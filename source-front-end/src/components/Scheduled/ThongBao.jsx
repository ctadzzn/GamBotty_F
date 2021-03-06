import { useRef, useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import Axios from 'axios';
import moment from "moment";

const ThongBao = (props) => {
    const { SendMessage, edit } = props;
    const [accessToken, setAccessToken] = useState("");
    const [valid, setValid] = useState(
        {
            "accessToken": false,
            "messageText": false,
            "time": false,
            "itemExcel": false
        }
    );
    const [messageText, setMessageText] = useState("");
    const [time, setTime] = useState(moment(new Date()).format("YYYY-MM-DDTHH:mm"));
    const [itemExcel, setItemExcel] = useState();
    const [urlImage, setUrlImage] = useState("");
    const [loading, setLoading] = useState();
    const [tenThongBao, setTenThongBao] = useState("");

    const ref = useRef();
    const refImage = useRef();
    const CheckValid = () => {
        const temp = {
            "accessToken": valid.accessToken,
            "messageText": valid.messageText,
            "time": valid.time,
            "itemExcel": valid.itemExcel
        }
        if (String.isNullOrEmpty(accessToken)) {
            temp.accessToken = true;
        }
        else {
            temp.accessToken = false;
        }
        if (String.isNullOrEmpty(messageText)) {
            temp.messageText = true;
        }
        else {
            temp.messageText = false;
        }
        if (new Date(time) < (new Date())) {
            temp.time = true;
        }
        else {
            temp.time = false;
        }
        if (String.isNullOrEmpty(itemExcel)) {
            temp.itemExcel = true;
        }
        else {
            temp.itemExcel = false;
        }
        setValid(temp);
    }
    const handleImage = () => {
        if (refImage.current.value === "") {
            setUrlImage("");
        }
        else {
            setLoading(true);
            if (refImage.current.files[0].type === "image/png" || refImage.current.files[0].type === "image/gif" || refImage.current.files[0].type === "image/jpeg") {
                var formdata = new FormData();
                formdata.append("upload_preset", "gkwmyrco");
                formdata.append("file", refImage.current.files[0]);
                Axios.post("https://api.cloudinary.com/v1_1/douchplum/image/upload", formdata)
                    .then(response => {
                        setUrlImage(response.data.url);
                        alert("T???i ???nh l??n th??nh c??ng!!!");
                        setLoading(false);
                    });
            }
            else {
                refImage.current.value = "";
                setLoading(false);
                alert("File kh??ng h???p l???");
            }
        }
    }
    // import file
    const readExcel = (file) => {
        if (ref.current.value === "") {
            setItemExcel("");
        }
        else {
            const promise = new Promise((resolve, reject) => {
                const filereader = new FileReader();
                filereader.readAsArrayBuffer(file)
                filereader.onload = (e) => {
                    const bufferArray = e.target.result;
                    const wb = XLSX.read(bufferArray, { type: 'buffer' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws);
                    const temp = data[0];
                    if (Object.keys(temp)[0] === "No." && Object.keys(temp)[1] === "Account") {
                        resolve(data);
                    }
                    else {
                        alert("File kh??ng ????ng ?????nh d???ng");
                        ref.current.value = "";
                    }
                    filereader.onerror = (error) => {
                        reject(error);
                    };
                };
            });
            promise.then((d) => {
                console.log(d);
                var temp = [];
                d.forEach(item => {
                    temp.push({ "account": item["Account"] })
                });
                Axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/check`, temp)
                    .then(response => {
                        console.log(response.data);
                    }).catch(error => {
                        console.log(error.response.data);
                        alert("???? ph??t hi???n account l???i. File m?? t??? s??? t??? ?????ng t???i xu???ng.");
                        const link = document.createElement("a");
                        link.href = error.response.data.url;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                setItemExcel(d);
                console.log(itemExcel);
            });
        }
    }
    // Check null or Empty
    String.isNullOrEmpty = function (value) {
        return (!value || value === undefined || value === "" || value.length === 0 || value === null);
    }
    // Reset input
    const Reset = () => {
        setTime(moment(new Date()).format("YYYY-MM-DDTHH:mm"));
        setAccessToken("");
        setItemExcel("");
        setMessageText("");
        setUrlImage("");
        setTenThongBao("");
        ref.current.value = "";
        refImage.current.value = "";
    }
    // B???t s??? ki???n n??t l??u
    const handleSubmit = () => {
        CheckValid();
        if (!String.isNullOrEmpty(accessToken) && !String.isNullOrEmpty(messageText) && itemExcel !== null && new Date() < new Date(time)) {
            SendMessage(accessToken, messageText, null, urlImage, time, itemExcel, tenThongBao);
            alert("L??u l???ch g???i th??ng b??o th??nh c??ng");
            Reset();
        }
    }


    // useEffect(() => {
    //     if (edit.enable) {
    //         setTime(moment(edit.message.scheduled).format("YYYY-MM-DDTHH:mm"));
    //         setAccessToken(edit.message.accessToken);
    //         setMessageText(edit.message.textMessage);
    //         setUrlImage(edit.message.imageUrl);
    //     }
    //     else {
    //         Reset();
    //     }
    // }, [edit])


    return (
        <div className="ThongBao">
            <div className="text-left">
                <div className="form-group">
                    <label><strong>Access token</strong> <strong className="text-danger">(*)</strong></label>
                    <input type="text" className={`form-control ` + (valid.accessToken ? "is-invalid" : "")} value={accessToken} onChange={(e) => { setAccessToken(e.target.value); }} />
                    <small htmlFor="noiDung" className="form-text text-muted">Ch??ng t??i s??? kh??ng chia s??? m?? access token c???a b???n cho b???t k??? ai</small>
                    <div className="invalid-feedback">
                        Access token kh??ng ???????c ????? tr???ng
                    </div>
                </div>
                <div className="form-group">
                    <label><strong>T??n th??ng b??o</strong>  <strong className="text-danger">(*)</strong></label>
                    <input type="text"
                        className={`form-control ` + (valid.accessToken ? "is-invalid" : "")}
                        value={tenThongBao}
                        onChange={(e) => setTenThongBao(e.target.value)} />
                    <div className="invalid-feedback">
                        T??n th??ng b??o kh??ng ???????c ????? tr???ng
                    </div>
                </div>
                <div className="form-group">
                    <label ><strong>Danh s??ch ng?????i nh???n</strong> <strong className="text-danger">(*)</strong></label>
                    <div className="row">
                        <div className="col-4">
                            <input type="file" className={`form-control-file ` + (valid.itemExcel ? "is-invalid" : "")} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ref={ref} onChange={(e) => { readExcel(e.target.files[0]) }} />
                            <div className="invalid-feedback">
                                Danh s??ch ng?????i nh???n kh??ng ???????c ????? tr???ng
                            </div>
                        </div>
                        <div className="col-8">
                            <a href="https://res.cloudinary.com/douchplum/raw/upload/v1642662382/ImportUserExample_gvuh94.xlsx" className="btn btn-success" download> T???i file m???u</a>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label ><strong>N???i dung th??ng b??o</strong> <strong className="text-danger">(*)</strong></label>
                    <textarea rows="5" className={`form-control ` + (valid.messageText ? "is-invalid" : "")} value={messageText} onChange={(e) => { setMessageText(e.target.value) }} />
                    <div className="invalid-feedback">
                        N???i dung th??ng b??o kh??ng ???????c ????? tr???ng
                    </div>
                </div>
                <div className="form-group">
                    <label><strong>H??nh ???nh ????nh k??m</strong></label>
                    {loading && (
                        <div className="loaderImage">
                            <div className="bar bar1"></div>
                            <div className="bar bar2"></div>
                            <div className="bar bar3"></div>
                        </div>
                    )
                    }
                    <input type="file" className={`form-control-file ` + (loading ? "invisible" : "")} accept="image/png, image/gif, image/jpeg" ref={refImage} onChange={handleImage} />
                    {urlImage &&
                        <img className="w-25" src={urlImage} alt=""></img>
                    }
                </div>
                <div className="form-group">
                    <label><strong>Th???i gian</strong> <strong className="text-danger">(*)</strong></label>
                    <input type="datetime-local" className={`form-control ` + (valid.time ? "is-invalid" : "")} value={time} onChange={(e) => { setTime(e.target.value) }} />
                    <div className="invalid-feedback">
                        Th???i gian ph???i l???n h??n th???i gian hi???n t???i
                    </div>
                </div>
            </div>
            <button className="btn btn-info  pl-4 pr-4" onClick={handleSubmit}>L??u</button>
            <button className="btn btn-danger  ml-2" onClick={Reset}>Nh???p l???i</button>
        </div>
    )
}
export default ThongBao;