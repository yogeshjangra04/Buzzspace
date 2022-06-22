import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useSelector, useDispatch } from "react-redux";

const PersistAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const dispatch = useDispatch();
    const accessToken = useSelector(state => state.accessToken.accessToken);

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            } catch (e) {
                return e
            }
            finally {
                setIsLoading(false);
            }
        }

        !accessToken ? verifyRefreshToken() : setIsLoading(false)
    }, []);

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`at: ${accessToken}`);
    }, [isLoading])

    return (
        <>
            {isLoading ? <p>Loading...</p> : <Outlet />}
        </>
    )
}

export default PersistAuth;