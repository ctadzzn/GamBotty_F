import { useRef, useState } from "react";
import * as XLSX from 'xlsx';
import Axios from 'axios';

const ThongBao = (props) => {
    const { SendMessage } = props;
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
    const [itemExcel, setItemExcel] = useState();
    const [urlImage, setUrlImage] = useState();
    const [loading, setLoading] = useState();
    const [tenThongBao, setTenThongBao] = useState("");

    const ref = useRef();
    const refImage = useRef();

    const CheckValid = () => {
        const temp = {
            "accessToken": valid.accessToken,
            "messageText": valid.messageText,
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
                        alert("Tải ảnh lên thành công!!!");
                        setLoading(false);
                    });
            }
            else {
                refImage.current.value = "";
                setLoading(false);
                alert("File không hợp lệ");
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
                        alert("File không đúng định dạng");
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
                        alert("Đã phát hiện account lỗi. File mô tả sẽ tự động tải xuống.");
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

        setAccessToken("");
        setItemExcel("");
        setMessageText("");
        setTenThongBao("");
        ref.current.value = "";
        refImage.current.value = "";
    }
    // Bắt sự kiện nút lưu
    const handleSubmit = () => {
        CheckValid();
        if (!String.isNullOrEmpty(accessToken) && !String.isNullOrEmpty(messageText) && itemExcel !== null) {
            SendMessage(accessToken, messageText, null, urlImage, itemExcel, tenThongBao);
            alert("Thêm thành công!!!");
            Reset();
        }
    }

    return (
        <div className="ThongBao">
            <div className="text-left">
                <div className="form-group">
                    <label><strong>Access token</strong> <strong className="text-danger">(*)</strong></label>
                    <input type="text" className={`form-control ` + (valid.accessToken ? "is-invalid" : "")} value={accessToken} onChange={(e) => { setAccessToken(e.target.value); }} />
                    <small htmlFor="noiDung" className="form-text text-muted">Chúng tôi sẽ không chia sẻ mã ACCESS TOKEN của bạn cho bất kỳ ai</small>
                    <div className="invalid-feedback">
                        Access token không được để trống
                    </div>
                </div>
                <div className="form-group">
                    <label><strong>Tên thông báo</strong>  <strong className="text-danger">(*)</strong></label>
                    <input type="text"
                        className={`form-control ` + (valid.accessToken ? "is-invalid" : "")}
                        value={tenThongBao}
                        onChange={(e) => setTenThongBao(e.target.value)} />
                    <div className="invalid-feedback">
                        Tên thông báo không được để trống
                    </div>
                </div>
                <div className="form-group">
                    <label ><strong>Danh sách người nhận</strong> <strong className="text-danger">(*)</strong></label>
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
                    <label ><strong>Nội dung thông báo</strong> <strong className="text-danger">(*)</strong></label>
                    <textarea rows="5" className={`form-control ` + (valid.messageText ? "is-invalid" : "")} value={messageText} onChange={(e) => { setMessageText(e.target.value) }} />
                    <div className="invalid-feedback">
                        Nội dung thông báo không được để trống
                    </div>
                </div>
                <div className="form-group">
                    <label><strong>Hình ảnh đính kèm</strong></label>
                    {loading && (
                        <div className="loaderImage">
                            <div className="bar bar1"></div>
                            <div className="bar bar2"></div>
                            <div className="bar bar3"></div>
                        </div>
                    )
                    }
                    <input type="file" className={`form-control-file ` + (loading ? "invisible" : "")} accept="image/png, image/gif, image/jpeg" ref={refImage} onChange={handleImage} />
                </div>

            </div>
            <button className="btn btn-info  pl-4 pr-4" onClick={handleSubmit}>Gửi</button>
            <button className="btn btn-danger  ml-2" onClick={Reset}>Nhập lại</button>
        </div>
    )
}
export default ThongBao;