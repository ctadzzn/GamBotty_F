import axios from 'axios';
import { useState } from 'react';
import './App.css';
import MessageHistory from './components/MessageComponents/MessageHistory';
import MessageManagement from './components/MessageManagement/MessageManagement';
import MainScheduled from './components/Scheduled/MainScheduled';
import MainSent from './components/Sent/MainSent';
import MainSurvey from './components/SurveyComponents/MainSurvey';
const App = () => {

  const [option, setOption] = useState('sent');

  return (
    <div >
      <div className="bg-dark h-100 p-4 h3 text-white text-left">
        This your header
      </div>

      <div className=''>
        <div className='row m-0'>

          <div className='col-md-12 col-lg-3 col-xl-3'>
            <style>
              {"\
          @media (min-width: 992px){\
            .navbar-expand-lg .navbar-nav{\
                -ms-flex-direction: column;\
                flex-direction: column;\
            }\
            }\
        "}
            </style>
            <nav className="navbar navbar-expand-lg navbar-light bg-light side-menu" id='side-menu'>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto w-100">
                  <li className="nav-item active">
                    <article className='mb-4'>
                      <p className='mb-4'>
                        <strong>Gửi ngay</strong>
                      </p>
                      <p onClick={() => setOption('sent')} className='text-center border btn-create-broadcast p-2 mb-2 rounded bg-white active text-dark ' style={{ cursor: 'pointer' }} >
                        <strong>+ Tạo mới</strong>
                      </p>
                    </article>
                  </li>
                  <li className="nav-item">
                    <article className='mb-4'>
                      <p className='mb-4'>
                        <strong>Đặt lịch gửi</strong>
                      </p>
                      <p onClick={() => setOption('scheduled')} className='text-center border btn-create-broadcast p-2 mb-2 rounded bg-white activee' style={{ cursor: 'pointer' }} >
                        <strong>+ Tạo mới</strong>
                      </p>
                    </article>
                  </li>
                  <li className="nav-item ">
                    <article className='mb-4'>
                      <p className='mb-4'>
                        <strong>Kết quả đánh giá</strong>
                      </p>
                      <p onClick={() => setOption('survey')} className='text-center border btn-create-broadcast p-2 mb-2 rounded bg-white activee' style={{ cursor: 'pointer' }} >
                        <strong>Xem ngay</strong>
                      </p>
                    </article>
                  </li>
                  <li className="nav-item ">
                    <article className='mb-4'>
                      <p className='mb-4'>
                        <strong>Lịch sử đánh giá</strong>
                      </p>
                      <p onClick={() => setOption('surveyHistory')} className='text-center border btn-create-broadcast p-2 mb-2 rounded bg-white activee' style={{ cursor: 'pointer' }} >
                        <strong>Xem ngay</strong>
                      </p>
                    </article>
                  </li>
                  <li className="nav-item ">
                    <article className='mb-4'>
                      <p className='mb-4'>
                        <strong>Quản lý thông báo</strong>
                      </p>
                      <p onClick={() => setOption('messageManagement')} className='text-center border btn-create-broadcast p-2 mb-2 rounded bg-white activee' style={{ cursor: 'pointer' }} >
                        <strong>Cập nhật</strong>
                      </p>
                    </article>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className='col-md-12 col-lg-9 col-xl-9'>
            {
              option === "sent" && <MainSent />
            }
            {
              option === "scheduled" && <MainScheduled />
            }
            {
              option === "survey" && <MessageHistory />
            }
            {
              option === "surveyHistory" && <MainSurvey />
            }
            {
              option === "messageManagement" && <MessageManagement />
            }
          </div>
        </div>

      </div>

    </div>
  );
}
export default App;