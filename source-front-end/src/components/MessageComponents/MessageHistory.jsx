import moment from "moment";
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import "./MessageHistory.css";


const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';



const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });



    FileSaver.saveAs(data, fileName + fileExtension);
}

const MessageHistory = () => {

    const [data, setData] = useState([]);
    const [survey, setSurvey] = useState(null);
    const [currentData, setCurrentData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [search, setSerach] = useState("");
    const [surveyType, setSurveyType] = useState("all");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    var [listUser, setListUser] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/surveyHistory`, requestOptions)
            .then(response => response.text())
            .then(result => {
                var temp = JSON.parse(result);
                setData(temp);
            })
            .catch(error => console.log('error', error));

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users`, requestOptions)
            .then(response => response.text())
            .then(result => {
                var temp = JSON.parse(result);
                setListUser(temp);
            })
            .catch(error => console.log('error', error));
        fetch("https://script.google.com/macros/s/AKfycbw3ChWk633RQFYn-F8CpOZTIZ9buLWQcvAddZoocuxKPL9i30M/exec", requestOptions)
            .then(response => response.text())
            .then(result => {
                var temp = JSON.parse(result).content;
                setSurvey(temp);
                setLoading(false);
            })
            .catch(error => console.log('error', error));
    }, [])


    useEffect(() => {
        if (data.length !== 0) {
            setCurrentPage();
            setPageSize(data.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const groupBy = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };




    const handleDownload = (id) => {
        var temp = survey.filter((a) => a.message_id === id);

        temp.forEach((item) => {
            item.time = moment(new Date(item.time)).format("DD/MM/YYYY HH:mm:ss");
            console.log(item.sender_id);
            const temp = listUser.filter((a) => a.id.toString() === item.sender_id.toString());
            item["sender_account"] = temp[0].account;
            item["sender_name"] = temp[0].username;
            // console.log(temp[0].username);
            // item["bu"] = temp[0].bu;
            // const bu = temp[0].username.split('(');
            // item["Sender Bu"] = bu[1].replace(")", "");
            item["sender_department"] = temp[0].bu;
        })
        exportToCSV(temp, "Detail_Survey_History");
    }
    const setCurrentPage = () => {
        var tempData = data;
        if (search !== "") {
            tempData = tempData.filter(item => item.messageName.includes(search));
        }
        if (surveyType !== "all") {
            tempData = tempData.filter(item => item.payload === surveyType);
        }
        if (from !== "") {
            tempData = tempData.filter(item => moment(new Date(item.createdAt)).format("DD/MM/YYYY HH:mm") >= moment(new Date(from)).format("DD/MM/YYYY HH:mm"))
        }
        if (to !== "") {
            tempData = tempData.filter(item => moment(new Date(item.createdAt)).format("DD/MM/YYYY HH:mm") <= moment(new Date(to)).format("DD/MM/YYYY HH:mm"))
        }
        setPageSize(tempData.length);
        const numberPage = (tempData.length % 5 === 0 ? tempData.length / 5 : tempData.length / 5 + 1);
        if (page === numberPage) {
            setCurrentData(tempData.slice((page - 1) * 5, tempData.length));
        }
        else {
            setCurrentData(tempData.slice((page - 1) * 5, (page * 5)));
        }
    }

    useEffect(() => {
        if (data.length !== 0) {
            setCurrentPage();
            setPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [surveyType, from, to, search]);




    useEffect(() => {
        // 1 ---> 0 -> 9
        // 2 ---> 10 -> 19
        setCurrentPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);



    const PageList = (props) => {
        const { length, pageCurrent, setPage } = props;
        const numberPage = (length % 5 === 0 ? length / 5 : length / 5 + 1);
        var element = [];
        for (let index = 1; index <= numberPage; index++) {
            element.push(index);
        }
        return (
            <div className="btn-group text-center">
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
        <div className="MessageHistory">
            <div className="form-group row m-0">
                {/* select */}
                <select name="choice" id="choice" className="form-control col-md-12 col-lg-2 col-xl-2  ml-md-2 ml-xl-0 ml-lg-0 mt-1" value={surveyType} onChange={(e) => { setSurveyType(e.target.value); }}>
                    <option value="all">Tất cả</option>
                    <option value="quick-reply">Rating</option>
                    <option value="question">{'Q&A'}</option>
                </select>
                {/* time from */}
                <div className="input-group col-md-12 col-lg-5 col-xl-5  ml-md-2 ml-xl-0 ml-lg-0 mt-1">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Từ</span>
                    </div>
                    <input type="datetime-local" className="form-control" value={from} onChange={(e) => { setFrom(e.target.value) }} />
                </div>
                {/* time to */}
                <div className="input-group col-md-12 col-lg-5 col-xl-5  ml-md-2 ml-xl-0 ml-lg-0 mt-1">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Đến</span>
                    </div>
                    <input type="datetime-local" className="form-control" value={to} onChange={(e) => { setTo(e.target.value) }} />
                </div>
                {/*search */}
                <input class="form-control mr-sm-2 col-md-12 col-lg-5 col-xl-5 mt-2 mb-2" type="search" placeholder="Tìm kiếm theo tên đánh giá" aria-label="Search" value={search} onChange={(e) => { setSerach(e.target.value) }}></input>
            </div>
            <div className="row m-0">
                <table className="table">
                    <thead className="thead">
                        <tr>
                            <th className="col-1">ID</th>
                            <th className="col-2">Tên đánh giá</th>
                            <th className="col-2 text-left">Nội dung đánh giá</th>
                            <th className="col-2">Thời gian tạo</th>
                            <th className="col-2">Thời gian gửi</th>
                            <th className="col-1">Loại đánh giá</th>
                            <th className="col-1">Phản hồi</th>
                            <th className="col-1">Xuất dữ liệu</th>
                        </tr>
                    </thead>
                </table>
            </div>
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
                    <>
                        <div className="row m-0">
                            <table className="table">
                                <tbody>
                                    {
                                        (currentData !== null && survey !== null) &&
                                        (
                                            currentData.map((item, index) => {
                                                var temp = Object.keys(groupBy(survey.filter((a) => a.message_id === item.id), "sender_name")).length;
                                                return (
                                                    <tr className="row m-0" key={index}>
                                                        <td className="col-1">{item.id}</td>
                                                        <td className="col-2">{item.messageName}</td>
                                                        <td className="col-2 text-left">{item.textMessage.replace("/n", " ")}</td>
                                                        <td className="col-2">{moment(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                                        <td className="col-2">{moment(item.sentAt).format("DD/MM/YYYY HH:mm")}</td>
                                                        <td className="col-1">{item.payload === "question" ? "Feedback" : "Rating"}</td>
                                                        <td className="col-1">{item.listMessageUser ? temp + "/ " + item.listMessageUser.filter((a) => a.status === "OK").length : "Không tìm thấy"}</td>
                                                        <td className="col-1"><button className="btn btn-primary" onClick={(e) => { handleDownload(item.id) }}>Tải về</button></td>
                                                    </tr>
                                                )

                                            })

                                        )
                                    }
                                </tbody>
                            </table>
                            {(currentData.length === 0) && <div className="text-center col-12">Không tìm thấy kết quả</div>}
                        </div>

                        {survey !== null && <PageList length={pageSize} pageCurrent={page} setPage={setPage} />}
                    </>
                )
            }

        </div>
    )
}
export default MessageHistory;