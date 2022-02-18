import { useRef, useState } from "react";
import * as XLSX from 'xlsx';
import moment from "moment";
const Survey = (props) => {
    const { SendMessage } = props;
    const [accessToken, setAccessToken] = useState("");
    const [messageText, setMessageText] = useState("");
    const [time, setTime] = useState(moment(new Date()).format("YYYY-MM-DDTHH:mm"));
    const [itemExcel, setItemExcel] = useState();
    const [payload, setPayload] = useState("");
    const [tenDanhGia, setTenDanhGia] = useState("");
    const ref = useRef();
    const [valid, setValid] = useState(
        {
            "accessToken": false,
            "messageText": false,
            "time": false,
            "itemExcel": false,
            "payload": false
        }
    );
    const CheckValid = () => {
        const temp = {
            "accessToken": valid.accessToken,
            "messageText": valid.messageText,
            "time": valid.time,
            "itemExcel": valid.itemExcel,
            "payload": valid.payload
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
        if (String.isNullOrEmpty(payload)) {
            temp.payload = true;
        }
        else {
            temp.payload = false;
        }
        setValid(temp);
    }
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
                        alert("File không đúng định dạng");
                        ref.current.value = "";
                    }
                    filereader.onerror = (error) => {
                        reject(error);
                    };
                };
            });
            promise.then((d) => {
                console.log(d)
                setItemExcel(d);
                console.log(itemExcel);
            });
        }
    }
    const Reset = () => {
        setMessageText("");
        setTime(moment(new Date()).format("YYYY-MM-DDTHH:mm"));
        setAccessToken("");
        setItemExcel("");
        setPayload("");
        setTenDanhGia("");
        ref.current.value = "";
    }
    String.isNullOrEmpty = function (value) {
        return (!value || value === undefined || value === "" || value.length === 0 || value === null);
    }
    const handleSubmit = () => {
        CheckValid();
        if (!String.isNullOrEmpty(accessToken) && !String.isNullOrEmpty(messageText) && itemExcel !== null && new Date() < new Date(time) && !String.isNullOrEmpty(payload)) {
            SendMessage(accessToken, messageText, payload, null, time, itemExcel, tenDanhGia);
            Reset();
            alert("Nhập thông tin thành công");
        }
    }
    return (
        <div className="Survey">
            <form className="text-left">
                <div className="form-group">
                    <label><strong>Access token</strong>  <strong className="text-danger">(*)</strong></label>
                    <input type="text"
                        className={`form-control ` + (valid.accessToken ? "is-invalid" : "")}
                        aria-describedby="noiDung"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)} />
                    <small htmlFor="noiDung" className="form-text text-muted">Chúng tôi sẽ không chia sẻ mã ACCESS TOKEN của bạn cho bất kỳ ai</small>
                    <div className="invalid-feedback">
                        Access token không được để trống
                    </div>
                </div>
                <div className="form-group">
                    <label><strong>Tên đánh giá</strong>  <strong className="text-danger">(*)</strong></label>
                    <input type="text"
                        className={`form-control ` + (valid.accessToken ? "is-invalid" : "")}
                        value={tenDanhGia}
                        onChange={(e) => setTenDanhGia(e.target.value)} />
                    <div className="invalid-feedback">
                        Tên đánh giá không được để trống
                    </div>
                </div>
                <div className="form-group">
                    <label><strong>Danh sách người nhận </strong><strong className="text-danger">(*)</strong></label>
                    <div className="row">
                        <div className="col-4">
                            <input type="file" className={`form-control-file ` + (valid.itemExcel ? "is-invalid" : "")} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ref={ref} onChange={(e) => { readExcel(e.target.files[0]) }} />
                            <div className="invalid-feedback">
                                Danh sách người nhận không được để trống
                            </div>
                        </div>
                        <div className="col-8">
                            <a href="https://res.cloudinary.com/douchplum/raw/upload/v1642662382/ImportUserExample_gvuh94.xlsx" className="btn btn-success" download> Tải file mẫu</a>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label><strong>Nội dung đánh giá</strong> <strong className="text-danger">(*)</strong></label>
                    <textarea type="text" rows="5" className={`form-control ` + (valid.messageText ? "is-invalid" : "")} value={messageText} onChange={(e) => setMessageText(e.target.value)} />
                    <div className="invalid-feedback">
                        Nội dung đánh giá không được để trống
                    </div>
                </div>
                <div className="form-group">
                    <label ><strong>Thời gian</strong>  <strong className="text-danger">(*)</strong></label>
                    <input type="datetime-local" className={`form-control ` + (valid.time ? "is-invalid" : "")} value={time} onChange={(e) => setTime(e.target.value)} />
                    <div className="invalid-feedback">
                        Thời gian phải lớn hơn thời gian hiện tại
                    </div>
                </div>
                <div className="form-group">
                    <label className={`form-check-label ` + (valid.time ? "is-invalid" : "")} ><strong>Loại đánh giá </strong><strong className="text-danger">(*)</strong></label>
                    <select className="form-control custom-select" value={payload} onChange={(e) => setPayload(e.target.value)}>
                        <option className="form-control" value="" disabled="disabled">---Chọn item---</option>
                        <option value="question">Feedback</option>
                        <option value="quick-reply">Rating</option>
                    </select>
                    <div className="invalid-feedback">
                        Loại đánh giá chưa được chọn
                    </div>
                </div>
            </form>
            <button className="btn btn-info  pl-4 pr-4" onClick={handleSubmit}>Lưu</button>
            <button className="btn btn-danger ml-4" onClick={Reset}>Nhập lại</button>
        </div>
    )
}
export default Survey;