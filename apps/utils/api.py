from dateutil.relativedelta import relativedelta
import datetime
import json

from django.db.models import Avg,Max,Min,Sum,Count
from django.http import JsonResponse
from django.db import connection

from apps.utils.models import Channel,Feed,AggregateMonthlyFeed,AggregateDailyFeed
from util.scripts.timing_decorator import time_usage

def getFeeds(request):
    """
    To use this API, you can filter based on four parameters. You can filter by channel, start time or end time. These three could be used indivually or together.
    The fourth parameter is the limit on number of results returned. The filtering is a GET request.
    
    An example would be  /mamase/api/feed/?channel=1&start='2015-09-09'&end='2015-09-10'&limit=10
    
    This API request will return a very complicate data structure. It has 5 levels namely Top Leval, Time Leval, Aggregation leval, Location leval then the data points
    """
    channel = request.GET.get('channel',None)
    start = request.GET.get('start',None)
    end = request.GET.get('end',None)
    limit = request.GET.get('limit',None)
    data = request.GET.get('data','raw')#Raw,Daily or Monthly

    kwargs = {}
    args = {}

    if channel:
        kwargs[ 'channel_id' ] = channel
        args['id'] = channel
        
    if start:
        kwargs[ 'timestamp__gte' ] = start

    if end:
        kwargs[ 'timestamp__lte' ] = end
        
    feed_without_null = []
    if data.lower() == "raw":
        feed = Feed.objects.filter(**kwargs).extra(select={'timestamp_formatted':"to_char(timestamp, 'YYYY-MM-DD HH24:MI:SS')"}).values('entry_id','channel_id','timestamp_formatted','field1','field2','field3','field4','field5','field6','field7','field8','id')    
        
        feed = list(feed)
        
        feed_without_null = removeNullValue(feed)

    elif data.lower() == "daily":
        feed = {}
        data = aggregateDailyFeedData(kwargs)
        feed['daily'] = ({'avg':list(data[0]),'min':list(data[3]), 'max':list(data[4]), 'count':list(data[2]), 'sum':list(data[1])})
        feed_without_null.append(feed)
        
    elif data.lower() == "monthly":
        feed = {}
        data = aggregateMonthlyFeedData(kwargs)
        feed['monthly'] = ({'avg':list(data[0]),'min':list(data[3]), 'max':list(data[4]), 'count':list(data[2]), 'sum':list(data[1])})
        feed_without_null.append(feed)

        #feed_without_null = aggregateMonthlyFeedData(kwargs)
        
    ch = Channel.objects.filter(**args).values('id','name','description','latitude','longitude','field1','field2','field3','field4','field5','field6','field7','field8')

    if limit:
        try:
            limit = int(limit)
            feed = feed[:limit]
        except:
            pass

    channel_without_null = removeEmptyString(ch)
        
        
    return JsonResponse(dict(channel=channel_without_null,feed=feed_without_null))

@time_usage
def getAllData(request):
    """
    This API request will return a very complicate data structure. It has 5 levels namely Top Leval, Time Leval, Aggregation leval, Location leval then the data points    
    """
    
    '''
    I shall test out two approaches. 
          - Get all this data from the database and use django aggregators to do the math and ordering for me
          - Get all data and do the ordering via a loop in code
    '''
    
    # For raw data can we use /mamase/api/feed/?channel=1&start='2015-09-09'&end='2015-09-10'&limit=10? The get parameters are just an example

    ch = Channel.objects.all()
    
    daily_avg = []
    daily_sum = []
    daily_cnt = []
    daily_min = []
    daily_max = []

    month_avg = []
    month_sum = []
    month_cnt = []
    month_min = []
    month_max = []

    for item in ch:
        chd_data = aggregateDailyFeedData({"channelfield__channel":item})
        chm_data = aggregateMonthlyFeedData({"channelfield__channel":item})
            
        daily_avg.append({item.id:list(chd_data[0])})
        daily_sum.append({item.id:list(chd_data[1])})
        daily_cnt.append({item.id:list(chd_data[2])})
        daily_min.append({item.id:list(chd_data[3])})
        daily_max.append({item.id:list(chd_data[4])})
        month_avg.append({item.id:list(chm_data[0])})
        month_sum.append({item.id:list(chm_data[1])})
        month_cnt.append({item.id:list(chm_data[2])})
        month_min.append({item.id:list(chm_data[3])})
        month_max.append({item.id:list(chm_data[4])})
        
    data = {}
    data['daily'] = ({'avg':daily_avg,'min':daily_min, 'max':daily_max, 'count':daily_cnt, 'sum':daily_sum})
    data['monthly'] = ({'avg':month_avg,'min':month_min, 'max':month_max, 'count':month_cnt, 'sum':month_sum})
    return JsonResponse(data)

def aggregateDailyFeedData(kwargs):
    d_avg = Feed.objects.filter(**kwargs).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-DD 12:00:00')"}).values('channelfield__channel','channelfield__field','channelfield__name','timestamp').annotate(Avg('reading'))

    d_sum = Feed.objects.filter(**kwargs).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-DD 12:00:00')"}).values('channelfield__channel','channelfield__field','channelfield__name','timestamp').annotate( Sum('reading'),    )
    
    d_min = Feed.objects.filter(**kwargs).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-DD 12:00:00')"}).values('channelfield__channel','channelfield__field','channelfield__name','timestamp').annotate( Min('reading'),   )

    d_max = Feed.objects.filter(**kwargs).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-DD 12:00:00')"}).values('channelfield__channel','channelfield__field','channelfield__name','timestamp').annotate(Max('reading'), )

    d_count = Feed.objects.filter(**kwargs).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-DD 12:00:00')"}).values('channelfield__channel','channelfield__field','channelfield__name','timestamp').annotate(Count('reading'), )
    
    d_count = removeZeroValue(d_count)
    d_avg = removeNullValue(d_avg)
    d_max = removeNullValue(d_max)
    d_min = removeNullValue(d_min)
    d_sum = removeNullValue(d_sum)

    return d_avg,d_sum,d_count,d_min,d_max

def aggregateMonthlyFeedData(kwargs): 
    month_filter = connection.ops.date_trunc_sql('month', 'timestamp')   
    #Let aggregate Monthly data
    
    m_avg = Feed.objects.filter(**kwargs).extra({'date':month_filter}).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-15 00:00:00')"}).values('channelfield__field','channelfield__channel','channelfield__name','timestamp').annotate(  Avg('reading'),)
    
    m_max = Feed.objects.filter(**kwargs).extra({'date':month_filter}).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-15 00:00:00')"}).values('channelfield__field','channelfield__channel','channelfield__name','timestamp').annotate( Avg('reading'),)
    
    m_max = Feed.objects.filter(**kwargs).extra({'date':month_filter}).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-15 00:00:00')"}).values('channelfield__field','channelfield__channel','channelfield__name','timestamp').annotate(  Avg('reading'),)
    
    m_max = Feed.objects.filter(**kwargs).extra({'date':month_filter}).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-15 00:00:00')"}).values('channelfield__field','channelfield__channel','channelfield__name','timestamp').annotate(  Avg('reading'),)
    
    m_max = Feed.objects.filter(**kwargs).extra({'date':month_filter}).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-15 00:00:00')"}).values('channelfield__field','channelfield__channel','channelfield__name','timestamp').annotate(  Avg('reading'),)
    
    m_max = Feed.objects.filter(**kwargs).extra({'date':month_filter}).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-15 00:00:00')"}).values('channelfield__field','channelfield__channel','channelfield__name','timestamp').annotate( Max('reading'), )
    
    m_min = Feed.objects.filter(**kwargs).extra({'date':month_filter}).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-15 00:00:00')"}).values('channelfield__field','channelfield__channel','channelfield__name','timestamp').annotate( Min('reading'),)
    
    m_sum = Feed.objects.filter(**kwargs).extra({'date':month_filter}).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-15 00:00:00')"}).values('channelfield__field','channelfield__channel','channelfield__name','timestamp').annotate( Sum('reading'),)
    
    m_count = Feed.objects.filter(**kwargs).extra({'date':month_filter}).extra(select={'timestamp':"to_char(timestamp, 'YYYY-MM-15 00:00:00')"}).values('channelfield__field','channelfield__channel','channelfield__name','timestamp').annotate( Count('reading'),)
    
    m_count = removeZeroValue(m_count)
    m_avg = removeNullValue(m_avg)
    m_max = removeNullValue(m_max)
    m_min = removeNullValue(m_min)
    m_sum = removeNullValue(m_sum)
    
    return m_avg,m_sum,m_count,m_min,m_max
    #Maybe ignore the loop for now (Approach 3). Will take up alot of precious time designing the logic and most probably it will be slower
    
    #So the above works great. Like a charm. But it is not sorted by channels. I might have to do a loop on all channels and get data for that specific channel and return that as a dictionary
    #A loop might be unavoidable but it shall not be more than 10. (Number of channels) and that is acceptable by my books.


    
    #Have this as two processes. Calculate and store result as JSON string. Do a query and get latest json string
    
def storeAggregatedData():
    '''
    - Get most recent data(Monthly and repeat for daily)
    - If no recent data, add all data till now
    - else continue
    - Check if it should be updated
    - If no, add new entry
    - If yes, overwrite with new content
    - Save
    #Need to remove the None/null's from the data
    '''
    
    #I am tired. Forgive my poorly arranged code. I pray I come back and fix all this later. 

    ch = Channel.objects.all()
    for item in ch:

        currentmonthly = AggregateMonthlyFeed.objects.filter(channel=item).order_by('-timestamp').first()
        currentdaily = AggregateDailyFeed.objects.filter(channel=item).order_by('-timestamp').first()    
        
        if not currentmonthly: 
            mdata = aggregateMonthlyFeedData({'channelfield__channel':item})

            month_avg = list(mdata[0])
            month_sum = list(mdata[1])
            month_cnt = list(mdata[2])
            month_min = list(mdata[3])
            month_max = list(mdata[4])        
            
            for ma in month_avg:
                x = AggregateMonthlyFeed(data = ma,channel = item,aggregation = 'AVG',timestamp = ma['timestamp'])
                x.save()
            
            for ms in month_sum:
                x = AggregateMonthlyFeed(data = ms,channel = item,aggregation = 'SUM',timestamp = ms['timestamp'])
                x.save()
            
            for mc in month_cnt:
                x = AggregateMonthlyFeed(data = mc,channel = item,aggregation = 'COUNT',timestamp = mc['timestamp'])
                x.save()

            for mmi in month_min:
                x = AggregateMonthlyFeed(data = mmi,channel = item,aggregation = 'MIN',timestamp = mmi['timestamp'])
                x.save()

            for mma in month_max:
                x = AggregateMonthlyFeed(data = mma,channel = item,aggregation = 'MAX',timestamp = mma['timestamp'])
                x.save()            

        elif not currentdaily:
            ddata = aggregateDailyFeedData({'channelfield__channel':item})
            
            daily_avg = list(ddata[0])
            daily_sum = list(ddata[1])
            daily_cnt = list(ddata[2])
            daily_min = list(ddata[3])
            daily_max = list(ddata[4])

            for da in daily_avg:
                x = AggregateDailyFeed(data = da,channel = item,aggregation = 'AVG',timestamp = da['timestamp'])
                x.save()
            
            for ds in daily_sum:
                x = AggregateDailyFeed(data = ds,channel = item,aggregation = 'SUM',timestamp = ds['timestamp'])
                x.save()

            for dc in daily_cnt:
                x = AggregateDailyFeed(data = dc,channel = item,aggregation = 'COUNT',timestamp = dc['timestamp'])
                x.save()
            
            for dmi in daily_min:
                x = AggregateDailyFeed(data = dmi,channel = item,aggregation = 'MIN',timestamp = dmi['timestamp'])
                x.save()
            
            for dma in daily_max:
                x = AggregateDailyFeed(data = dma,channel = item,aggregation = 'MAX',timestamp = dma['timestamp'])
                x.save()
                        
        else:
            m = datetime.datetime.now().month
            d = datetime.datetime.now().day
            
            thismonth = datetime.datetime.now().replace(day=1,hour=0,minute=0,second=0,microsecond=0)
            nextmonth = thismonth + relativedelta(months=1) 
            midmonth = datetime.datetime.now().replace(day=15,hour=0,minute=0,second=0,microsecond=0)
            
            today = datetime.datetime.now().replace(hour=0,minute=0,second=0,microsecond=0)
            
            timestampmonth = currentmonthly.timestamp.month 
            timestampday = currentdaily.timestamp.day
            
            #Get begging and end of the months to limit
            
            print "In channel loop. Now checking " + item.name
            if timestampmonth == m:
                data = aggregateMonthlyFeedData({'channelfield__channel':item,'timestamp__gte':thismonth,'timestamp__lte':nextmonth})
                                                
                mc = AggregateMonthlyFeed.objects.filter(aggregation = "COUNT",channel=item).order_by('-timestamp').first()
                ma = AggregateMonthlyFeed.objects.filter(aggregation = "AVG",channel=item).order_by('-timestamp').first()
                ms = AggregateMonthlyFeed.objects.filter(aggregation = "SUM",channel=item).order_by('-timestamp').first()
                mma = AggregateMonthlyFeed.objects.filter(aggregation = "MAX",channel=item).order_by('-timestamp').first()
                mmi = AggregateMonthlyFeed.objects.filter(aggregation = "MIN",channel=item).order_by('-timestamp').first()
                
                ma.data = list(data[0])
                ma.lastupdate = datetime.datetime.now()

                ms.data = list(data[1])
                ms.lastupdate = datetime.datetime.now()

                mc.data = list(data[2])
                mc.lastupdate = datetime.datetime.now()

                mmi.data = list(data[3])
                mmi.lastupdate = datetime.datetime.now()

                mma.data = list(data[4])
                mma.lastupdate = datetime.datetime.now()
                
                ma.save()
                ms.save()
                mc.save()
                mma.save()
                mmi.save()
                
            else:
                data = aggregateMonthlyFeedData({'channelfield__channel':item,'timestamp__gte':thismonth,'timestamp__lte':nextmonth})
            
                month_avg = list(data[0])
                month_sum = list(data[1])
                month_cnt = list(data[2])
                month_min = list(data[3])
                month_max = list(data[4])        
                
                if month_avg:
                    ma = AggregateMonthlyFeed(data = month_avg,channel = item,aggregation = 'AVG',timestamp = midmonth)
                    ma.save()

                if month_sum:
                    ms = AggregateMonthlyFeed(data = month_sum,channel = item,aggregation = 'SUM',timestamp = midmonth)
                    ms.save()

                if month_cnt:
                    mc = AggregateMonthlyFeed(data = month_cnt,channel = item,aggregation = 'COUNT',timestamp = midmonth)
                    mc.save()

                if month_min:
                    mmi = AggregateMonthlyFeed(data = month_min,channel = item,aggregation = 'MIN',timestamp = midmonth)
                    mma.save()

                if month_max:
                    mma = AggregateMonthlyFeed(data = month_max,channel = item,aggregation = 'MAX',timestamp = midmonth)                    
                    mmi.save()
                                                
            if timestampday == d:
                print "Updating todays records for channel " + item.name
                data = aggregateDailyFeedData({'channelfield__channel':item,'timestamp__gte':today})
                
                dc = AggregateDailyFeed.objects.filter(aggregation = "COUNT",channel=item).order_by('-timestamp').first()
                da = AggregateDailyFeed.objects.filter(aggregation = "AVG",channel=item).order_by('-timestamp').first()
                ds = AggregateDailyFeed.objects.filter(aggregation = "SUM",channel=item).order_by('-timestamp').first()
                dma = AggregateDailyFeed.objects.filter(aggregation = "MAX",channel=item).order_by('-timestamp').first()
                dmi = AggregateDailyFeed.objects.filter(aggregation = "MIN",channel=item).order_by('-timestamp').first()
                
                da.data = list(data[0])
                da.lastupdate = datetime.datetime.now()

                ds.data = list(data[1])
                ds.lastupdate = datetime.datetime.now()

                dc.data = list(data[2])
                dc.lastupdate = datetime.datetime.now()

                dma.data = list(data[3])
                dma.lastupdate = datetime.datetime.now()

                dmi.data = list(data[4])
                dmi.lastupdate = datetime.datetime.now()
                
                da.save()
                ds.save()
                dc.save()
                dma.save()
                dmi.save()
                
            else:
                data = aggregateDailyFeedData({'channelfield__channel':item,'timestamp__gte':today})
                                              
                daily_avg = list(data[0])
                daily_sum = list(data[1])
                daily_cnt = list(data[2])
                daily_min = list(data[3])
                daily_max = list(data[4])        
                
                if daily_avg:
                    da = AggregateDailyFeed(data = daily_avg,channel = item,aggregation = 'AVG',timestamp = today)
                    da.save()
                    
                if daily_sum:
                    ds = AggregateDailyFeed(data = daily_sum,channel = item,aggregation = 'SUM',timestamp = today)
                    ds.save()
                    
                if daily_cnt:
                    dc = AggregateDailyFeed(data = daily_cnt,channel = item,aggregation = 'COUNT',timestamp = today)
                    dc.save()

                if daily_min:
                    dmi = AggregateDailyFeed(data = daily_min,channel = item,aggregation = 'MIN',timestamp = today)
                    dmi.save()
                
                if daily_max:
                    dma = AggregateDailyFeed(data = daily_max,channel = item,aggregation = 'MAX',timestamp = today)
                    dma.save()

def removeNullValue(data):
    data_without_null = []
    for item in data:
        data_without_null.append(dict((k,v) for (k,v) in item.items() if v is not None))

    return data_without_null

def removeZeroValue(data):
    #For counts
    data_without_zero = []
    for item in data:
        data_without_zero.append(dict((k,v) for (k,v) in item.items() if v is not 0))

    return data_without_zero

def removeEmptyString(data):
    data_without_empty = []

    for item in data:
        data_without_empty.append(dict((k,v) for (k,v) in item.items() if v != ""))

    return data_without_empty

def updateAggregatedData():
    #Get all data for this year and aggregate it.
    pass
