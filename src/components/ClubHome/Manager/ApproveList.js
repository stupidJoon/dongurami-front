import React from "react";
import styles from "../../../styles/Club/Home/Manager/ApproveList.module.scss";

const ApproveList = ({ onApplyAccept, onApplyReject, applicantInfo }) => {
  return (
    <>
      {applicantInfo.map((info, index) => {
        return (
          <>
            <div key={info.id} className={styles.applierInfo}>
              <div>
                <span>이름: </span>
                <span>{info.name}</span>
              </div>
              <div>
                <span>학과: </span>
                <span>{info.major}</span>
              </div>
              <div>
                <span>학번: </span>
                <span>{info.id}</span>
              </div>
              <div>
                <span>전화번호: </span>
                <span>{info.phoneNum}</span>
              </div>
              {info.questions &&
                info.questions.map((question, i) => {
                  return (
                    <div key={question}>
                      <span>{question}</span>
                      <p>{info.answers[i]}</p>
                    </div>
                  );
                })}
            </div>
            <div key={index} className={styles.button}>
              <button id={index} onClick={onApplyAccept}>
                승인
              </button>
              <button id={index} onClick={onApplyReject}>
                거절
              </button>
              <hr />
            </div>
          </>
        );
      })}
    </>
  );
};

export default ApproveList;
