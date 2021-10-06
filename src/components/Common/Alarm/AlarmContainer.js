import styles from "../../../styles/Common/Alarm/AlarmContainer.module.scss";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { TiDelete } from "react-icons/ti";

const alarmCategoriNum = {
  0: "댓글이 달렸습니다.",
  1: "답글이 달렸습니다.",
  2: "동아리 가입이 승인되었습니다.",
  3: "동아리 가입이 거절되었습니다.",
  4: "새로운 일정이 생성되었습니다.",
  5: "일정이 수정되었습니다.",
  6: "오늘의 일정입니다.",
  7: "동아리 공지가 생성되었습니다.",
};

const AlarmContainer = () => {
  const [alarmList, setAlarmList] = useState([]);
  const router = useRouter();

  let jwtToken = "";
  if (typeof window !== "undefined") {
    jwtToken = localStorage.getItem("jwt");
  }

  // 알람 불러오기
  const getAlarmData = async () => {
    const options = {
      headers: {
        "Content-type": "application/json; charset=utf-8",
        "x-auth-token": jwtToken,
      },
    };
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notification/entire`,
        options
      )
      .then((res) => setAlarmList(res.data.notifications))
      .catch((err) => console.log(err.response.data));
  };
  const onAlarmClick = (url) => {
    router.push(url);
  };

  // 알람 전체 삭제
  const onAlarmDeleteAll = async () => {
    const options = {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=utf-8",
        "x-auth-token": jwtToken,
      },
    };

    confirm("전체 알람을 삭제하시겠습니까?") &&
      (await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notification/entire`,
        options
      )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.response.data)));
    getAlarmData();
  };

  // 알람 일부 삭제
  const onAlarmPatch = async (notiNum) => {
    console.log(notiNum);
    const options = {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=utf-8",
        "x-auth-token": jwtToken,
      },
    };
    await axios(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notification/${notiNum}`,
      options
    )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err.response.data));
    getAlarmData();
  };

  useEffect(() => {
    getAlarmData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.icons}>
        <FaTrashAlt size={13} onClick={onAlarmDeleteAll} />
      </div>
      <div className={styles.alarms}>
        {alarmList.slice(0, 3).map((alarm) => {
          return (
            <div className={styles.alarm} key={alarm.notificationNum}>
              <div className={styles.delAlarm}>
                <TiDelete
                  size={15}
                  onClick={() => onAlarmPatch(alarm.notificationNum)}
                />
              </div>
              <div
                className={styles.description}
                onClick={() => onAlarmClick(alarm.url)}
              >
                <p id={styles.big}>
                  {alarmCategoriNum[alarm.notificationCategoryNum]}
                </p>
                <div className={styles.bottom}>
                  <p>{alarm.senderId}</p>
                  <p>{alarm.inDate.substr(0, 10)}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles.leftAlarms}>
          <span>{alarmList.slice(3).length}개의 알람이 더 있습니다</span>
        </div>
      </div>
    </div>
  );
};

export default AlarmContainer;