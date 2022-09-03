import React, { useEffect, useState } from 'react';
import axios from 'axios';

const usePost = (url: string, body: any) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const controller = new AbortController();

    useEffect(() => {
        setLoading(true);
        axios.post(url, body, { signal: controller.signal }).then(res => {
            setData(res.data);
        }).catch(err => {
            setError(err);
            console.log(err);
        }).finally(() => {
            setLoading(false);
        });

        return () => controller.abort();
    }, [url]);

    return { data, loading, error };
}

export default usePost;