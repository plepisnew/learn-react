import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetch = (url: string) => {
    const [data, setData] = useState<string[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const controller = new AbortController();

    useEffect(() => {
        setLoading(true);
        axios
            .get(url, { signal: controller.signal })
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                setError(err);
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });

        return () => controller.abort();
    }, [url]);

    return { data, loading, error, setData, setLoading, setError };
};

export default useFetch;
