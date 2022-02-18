import moment from "moment";
import { useEffect, useState } from "react";
import './Survey.css';



const MainSurvey = () => {

    const [data, setData] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(data.length);
    const [sao, setSao] = useState("all");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const setCurrentPage = () => {
        var tempData = data;
        if (sao !== "all") {
            tempData = tempData.filter(item => item.danh_gia === sao);
        }
        if (from !== "") {
            tempData = tempData.filter(item => new Date(item.time) > new Date(from))
        }
        if (to !== "") {
            tempData = tempData.filter(item => new Date(item.time) <= new Date(to))
        }
        setPageSize(tempData.length);
        const numberPage = (tempData.length % 20 === 0 ? tempData.length / 20 : tempData.length / 20 + 1);
        if (page === numberPage) {
            setCurrentData(tempData.slice((page - 1) * 20, tempData.length));
        }
        else {
            setCurrentData(tempData.slice((page - 1) * 20, (page * 20)));
        }
    }
    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch("https://script.google.com/macros/s/AKfycbw3ChWk633RQFYn-F8CpOZTIZ9buLWQcvAddZoocuxKPL9i30M/exec", requestOptions)
            .then(response => response.text())
            .then(result => {
                setData(JSON.parse(result).content.sort((a, b) => a.time < b.time ? 1 : -1));
                setLoading(false);
            })
            .catch(error => console.log('error', error));
    }, [])


    useEffect(() => {
        if (data.length !== 0) {
            setCurrentData(data.slice(0, 20));
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    useEffect(() => {
        setPage(1);
    }, [sao])




    useEffect(() => {
        if (data.length !== 0) {
            setCurrentPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    useEffect(() => {
        // 1 ---> 0 -> 9
        // 2 ---> 10 -> 19
        setCurrentPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])
    useEffect(() => {
        setCurrentPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from, to, sao])


    const PageList = (props) => {
        const { length, pageCurrent, setPage } = props;
        const numberPage = (length % 20 === 0 ? length / 20 : length / 20 + 1);
        var element = [];
        for (let index = 1; index <= numberPage; index++) {
            element.push(index);
        }
        return (
            <div className="btn-group">
                {
                    element.map((item, index) => {
                        if (item === pageCurrent) {
                            return (

                                <button key={index} className="btn btn-info " >
                                    {item}
                                </button>
                            )
                        }
                        else {
                            return (

                                <button key={index} className="btn border-secondary bg-transparent text-dark" onClick={() => setPage(item)}>
                                    {item}
                                </button>
                            )
                        }

                    })
                }
            </div>
        )

    }
    return (
        <div className="MainSurvey">
            {
                loading && (
                    <div className="center">
                        <div className="loader"></div>
                    </div>
                )
            }
            {
                !loading &&
                (
                    <div>
                        <div className="">
                            <a href="https://docs.google.com/spreadsheets/d/182oluBUfMkV8YyOvJkDbN6RjCXYIf62bwTjFdYwP3Gk/export?format=xlsx" download className="btn btn-primary float-right">Xuất dữ liệu</a>
                            <div className="form-group row m-0">
                                <select name="choice" id="choice" className="form-control col-md-12 col-lg-2 col-xl-2  ml-md-2 ml-xl-0 ml-lg-0 mt-1" value={sao} onChange={(e) => { setSao(e.target.value) }}>
                                    <option value="all">Tất cả</option>
                                    <option value="1 sao">1 sao</option>
                                    <option value="2 sao">2 sao</option>
                                    <option value="3 sao">3 sao</option>
                                    <option value="4 sao">4 sao</option>
                                    <option value="5 sao">5 sao</option>
                                </select>
                                <div className="input-group col-md-12 col-lg-5 col-xl-5  ml-md-2 ml-xl-0 ml-lg-0 mt-1">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Từ</span>
                                    </div>
                                    <input type="datetime-local" className="form-control" value={from} onChange={(e) => { setFrom(e.target.value) }} />
                                </div> <div className="input-group col-md-12 col-lg-5 col-xl-5  ml-md-2 ml-xl-0 ml-lg-0 mt-1">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Đến</span>
                                    </div>
                                    <input type="datetime-local" className="form-control" value={to} onChange={(e) => { setTo(e.target.value) }} />
                                </div>

                            </div>

                        </div>
                        <div className="row m-0">
                            <table className="col-12">
                                <thead>
                                    <tr className="row">
                                        <th className="col-1">#</th>
                                        <th className="col-3">Tên đánh giá</th>
                                        <th className="col-1">Đánh giá</th>
                                        <th className="col-2">Đánh giá bởi</th>
                                        <th className="col-2">Vào lúc</th>
                                        <th className="col-3">Góp ý</th>
                                    </tr>

                                </thead>
                            </table>
                            <table className="table">
                                <tbody>
                                    {
                                        currentData.map((item, index) => {
                                            return (
                                                <tr key={index} className="row">
                                                    <td className="col-1">{index}</td>
                                                    <td className="col-3">{item.ten_danh_gia}</td>
                                                    <td className="col-1">{item.danh_gia} {item.danh_gia !== "" ? " sao" : ""}</td>
                                                    <td className="col-2">{item.sender_name}</td>
                                                    <td className="col-2">{moment(item.time).format("HH:mm DD-MM-YYYY")}</td>
                                                    <td className="col-3">{item.y_kien}</td>
                                                </tr>
                                            )

                                        })
                                    }

                                </tbody>
                            </table>
                            {(currentData.length === 0) && <div className="text-center col-12">Không tìm thấy kết quả</div>}
                            {
                                !loading && <PageList length={pageSize} pageCurrent={page} setPage={setPage} />
                            }
                        </div>
                    </div>
                )
            }

        </div>
    )
}
export default MainSurvey;