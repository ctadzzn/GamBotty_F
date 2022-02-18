import axios from "axios";
import dateFormat from "dateformat";
import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import "@fortawesome/fontawesome-free/css/all.css";
import ThongBao from "./ThongBao";

class Message {
    constructor(id, textMessage, imageUrl, createdAt, modifiedAt, scheduled, status) {
        this.id = id;
        this.textMessage = textMessage;
        this.imageUrl = imageUrl;
        this.createdAt = dateFormat(createdAt, "dd/mm/yyyy HH:MM:ss");
        this.modifiedAt = modifiedAt === null ? "-" : dateFormat(modifiedAt, "dd/mm/yyyy HH:MM:ss");
        this.scheduled = scheduled === null ? "-" : dateFormat(scheduled, "dd/mm/yyyy HH:MM:ss");
        this.status = status;
    }
}

const MessageStatus = {
    OK: "OK",
    WARNING: "Warning",
    FAILED: "Failed",
    SENDING: "Sending",
}

const MessageManagement = (props) => {

    const [editable, setEditable] = useState({
        enable: false,
        message: {}
    });
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // useEffect(() => fetchData(), []);
    // useEffect(() => fetchData(), [page]);
    useEffect(() => {
        if (!editable.enable || page >= 1) {
            fetchData();
        }
    }, [editable.enable, page]);

    const fetchData = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/messages?page=${page}`)
            .then(response => {
                setMessages(response.data.messages.map(msg => new Message(
                    msg.id,
                    msg.textMessage,
                    msg.imageUrl,
                    msg.createdAt,
                    msg.modifiedAt,
                    msg.scheduled,
                    msg.status
                )));
                setTotalPages(response.data.totalPages);
            })
            .catch(error => console.log('error', error));
    }

    const handlePageClick = (e) => {
        setPage(e.selected + 1);
    };

    const deleteMessage = (id) => {
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/messages/${id}`)
            .then(response => {
                console.log(response.data);
                alert("Xóa thành công");
                fetchData();
            })
            .catch(error => console.log('error', error));
    }

    const toggleEdit = (id) => {
        if (id === null || id === undefined) {
            setEditable({
                enable: false,
                message: {}
            });
            return;
        }
        if (!editable.enable) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/messages/${id}`)
                .then(response => setEditable({
                    enable: true,
                    message: response.data
                }))
                .catch(error => console.log('error', error));
        }
        else {
            setEditable({
                enable: false,
                message: {}
            });
        }
    }

    const updateMessage = (accessToken, message, payload, urlImage, scheduled, listUser, messageName) => {
        var temp = [];
        listUser.forEach(item => {
            temp.push({ "account": item["Account"] })
        });
        var raw = {
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
        };
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/messages/${editable.message.id}`, raw)
            .then(response => {
                console.log(response.data);
                alert("Update thành công!!!");
            })
            .catch(error => console.log('error', error))
            .finally(() => setEditable({
                enable: false,
                message: {}
            }));
    }

    return (
        <div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Message</th>
                        <th scope="col">Attachment</th>
                        <th scope="col">Recipients</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Modified At</th>
                        <th scope="col">Scheduled</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        messages.map(msg => {
                            var badge = "badge ";
                            if (msg.status === MessageStatus.OK) {
                                badge += "bg-success";
                            } else if (msg.status === MessageStatus.WARNING) {
                                badge += "bg-warning text-dark";
                            } else if (msg.status === MessageStatus.FAILED) {
                                badge += "bg-danger";
                            } else {
                                badge += "bg-primary";
                            }
                            return (
                                <tr key={msg.id}>
                                    <th scope="row">{msg.id}</th>
                                    <td>{msg.textMessage}</td>
                                    <td>
                                        <a href={msg.imageUrl}
                                            target="_blank"
                                            rel="noreferrer">Click here</a>
                                    </td>
                                    <td>
                                        <a href={`${process.env.REACT_APP_API_BASE_URL}/api/v1/messages/${msg.id}/message_users/excel`}
                                            download rel="noopener noreferrer">Click here</a>
                                    </td>
                                    <td>{msg.createdAt}</td>
                                    <td>{msg.modifiedAt}</td>
                                    <td>{msg.scheduled}</td>
                                    <td><span className={badge + " w-100"}>{msg.status === null ? "Un-send" : msg.status}</span></td>
                                    <td>
                                        {editable.enable &&
                                            <button className="btn" onClick={() => toggleEdit()}>
                                                <i className="fas fa-times-circle"></i>
                                            </button>
                                        }
                                        {!editable.enable &&
                                            <div>
                                                <button className="btn" onClick={() => toggleEdit(msg.id)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="btn" onClick={() => deleteMessage(msg.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            <ReactPaginate
                previousLabel="<<"
                nextLabel=">>"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                pageCount={totalPages}
                onPageChange={handlePageClick}
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
            />
            {
                editable.enable &&
                <ThongBao editable={editable} SendMessage={updateMessage}></ThongBao>
            }
        </div>
    );
}

export default MessageManagement;