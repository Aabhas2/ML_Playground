from rq import Worker, Queue 
from rq.connections import Connection 
import redis 

from app.core.config import settings 

def main(): 
    redis_conn = redis.Redis.from_url(settings.REDIS_URL) 
    queue_name = settings.RQ_QUEUE 

    with Connection(redis_conn): 
        worker = Worker([Queue[queue_name]]) 
        worker.work(with_scheduler=False) 

if __name__ == "__main__": 
    main()