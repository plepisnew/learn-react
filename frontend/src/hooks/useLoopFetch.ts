import React, { useEffect, useState } from 'react';
import axios from 'axios';
import sleep from 'util/sleep';

const useLoopFetch = (url: string, delayMillis: number, options: {
    initCallback?: Function;
    firstDataCallback?: Function;
    dataCallback?: Function;
    errorCallback?: Function;
    finalCallback?: Function;
} = {}) => {

    const [data, setData] = useState<any[]>();
    const [apparentData, setApparentData] = useState<any[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {

        if(options.initCallback) options.initCallback();
        const controller = new AbortController();
        sleep(delayMillis).then(() => {
            axios.get(url, { signal: controller.signal }).then(res => {
                        setData(res.data);
                        setLoading(true);
                        if(data?.length != res.data.length) setApparentData(res.data);
                        if(options.dataCallback) options.dataCallback();
                    }).catch(err => {
                        setError(err);
                        console.log(err);
                        if(options.errorCallback) options.errorCallback();
                    }).finally(() => {
                        setLoading(false);
                        if(options.finalCallback) options.finalCallback();
                        // if(firstFetch && options.firstDataCallback) options.firstDataCallback(); 
                        // firstFetch = false;
                    });
        })
        
        return () => controller.abort();
    }, [data])

    return { apparentData, data, loading, error };
}

export default useLoopFetch;