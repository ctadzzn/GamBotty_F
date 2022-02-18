
import { useState } from 'react';
import Survey from './Survey';
import ThongBao from './ThongBao';

const MainScheduled = () => {

    const SendMessage = (accessToken, message, payload, urlImage, scheduled, listUser, messageName) => {
        var myHeaders = new Headers();
        var temp = [];
        listUser.forEach(item => {
            temp.push({ "account": item["Account"] })
        })
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "accessToken": accessToken,
            "textMessage": message,
            "payload": payload,
            "imageUrl": urlImage,
            "createdAt": new Date(),
            "modifiedAt": null,
            "messageName": messageName,
            "deletedAt": null,
            "scheduled": new Date(scheduled),
            "sentAt": null,
            "status": null,
            "listMessageUser": temp
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/messages`, requestOptions)
            .then(response => {
                response.text();
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
    const [content, setContent] = useState("thongbao");
    return (
        <div className="container">
            <div className="card">
                <div className="card-header bg-info">
                    <div className="h5 text-white">Đặt lịch gửi {content === "thongbao" ? "thông báo" : "đánh giá"}</div>
                </div>
                <div className="card-body">
                    <div className='form-group text-left'>
                        <label htmlFor="loainoidung"><strong>Loại nội dung</strong> </label>
                        <select className='form-control' name='loainoidung' value={content} onChange={(e) => setContent(e.target.value)}>
                            <option value="thongbao">Thông báo</option>
                            <option value="survey">Survey</option>
                        </select>
                    </div>
                    {content === "thongbao" && <ThongBao SendMessage={SendMessage} />}
                    {content === "survey" && <Survey SendMessage={SendMessage} />}
                    {/* <Survey /> */}
                </div>
            </div>
        </div>
    )
}
export default MainScheduled;