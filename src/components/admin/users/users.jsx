
import { useEffect, useState } from 'react';
import Header from './header/header';
import Table from "./table/table";
import { useSelector } from 'react-redux';
import { getUsers } from '../helper';

const Users = () => {
    const [data, setData] = useState([])
    const [search, setSearch] = useState("")

    const [loading, setLoading] = useState(true)
    const authState = useSelector((state) => state.auth.loggedIn);
    const { message } = useSelector(
        (state) => state.notification
      );
    useEffect(() => {
        let abortcontroller;
        (async function () {
            setLoading(true)
            abortcontroller = new AbortController()
            const res = await getUsers(authState)
            setData(res.users);
            setLoading(false)
        })()
        return () => {
            abortcontroller.abort()
        };
    }, [authState, message])
    return (
        <>
            <Header search={search} setSearch={setSearch}/>
            <Table data={data} loading={loading} search={search}/>
        </>
    );
}

export default Users;
