from rq import Worker, Queue 
from rq.connections import Connection 
import redis 

from app.core.config import settings 

def main(): 
    queue_name = settings.RQ_QUEUE 
    redis_conn = redis.Redis.from_url(settings.REDIS_URL) 
    worker = Worker([Queue(queue_name, connection=redis_conn)], connection=redis_conn)
    worker.work()

if __name__ == "__main__": 
    main()