import React, { useRef } from "react";
import styles from "../../../styles/Club/Home/Manager/MembersList.module.scss";
import { RiVipCrownFill, RiVipCrownLine } from "react-icons/ri";

const MembersList = ({
  name,
  leader,
  auth1,
  auth2,
  studentId,
  changeLeader,
  onLeaderChange,
}) => {
  const applyAuth = useRef();
  const boardAuth = useRef();

  const onApplyAuthClick = () => {
    console.log(applyAuth.current.checked);
  };
  const onBoardAuth = () => {
    console.log(boardAuth.current.checked);
  };

  return (
    <div className={styles.member}>
      <div>
        {name === leader ? (
          <RiVipCrownFill />
        ) : (
          <RiVipCrownLine onClick={onLeaderChange} id={styles.changeLeader} />
        )}
        <span>{name}</span>
      </div>
      <div>
        <span ref={changeLeader} id={studentId}>
          {studentId}
        </span>
      </div>
      <div>
        <input
          type="checkBox"
          className={styles.appManage}
          defaultChecked={auth1 ? true : false}
          disabled={name === leader ? true : false}
          ref={applyAuth}
          onClick={onApplyAuthClick}
        />
      </div>
      <div>
        <input
          type="checkBox"
          className={styles.appManage}
          defaultChecked={auth2 ? true : false}
          disabled={name === leader ? true : false}
          ref={boardAuth}
          onClick={onBoardAuth}
        />
      </div>
    </div>
  );
};

export default MembersList;
