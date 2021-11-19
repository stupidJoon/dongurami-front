import styles from '../../../styles/Common/Header/Header.module.scss';
import { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BiBell } from 'react-icons/bi';
import Hamburger from 'hamburger-react';
import HeaderBoard from './HeaderBoard';
import HeaderUser from './HeaderUser';
import AlarmContainer from '../Alarm/AlarmContainer';
import HeaderMobileBoard from './HeaderMobileBoard';
import Link from 'next/link';
import getToken from 'utils/getToken';
import { useRouter } from 'next/router';
import { getUserData } from 'apis/user';
import { getAlarm, putAlarm, patchAlarm } from 'apis/alarm';

function Header() {
  const [open, setOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState();
  const [userProflie, setUserProfile] = useState();
  const [alarmList, setAlarmList] = useState([]);
  const [alarmShow, setAlarmShow] = useState(3);

  const closeRef = useRef(null);
  const router = useRouter();

  //영역밖 클릭 시 사이드바 제거
  const CloseSidebar = (ref) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
          setIsAlarmOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };

  // 알람 조회
  const getAlarmData = () => {
    getAlarm().then((res) => setAlarmList(res.data.notifications));
  };

  // 알람 전체 삭제
  const onAlarmDeleteAll = async () => {
    confirm('전체 알람을 삭제하시겠습니까?') &&
      (await putAlarm()
        .then((res) => alert(res.data.msg))
        .catch((err) => alert(err.response.data.msg)));
    getAlarmData();
  };

  // 알람 일부 삭제
  const onAlarmPatch = async (notiNum) => {
    await patchAlarm(notiNum).catch((err) => alert(err.response.data));
    getAlarmData();
  };

  const showMoreAlarm = () => {
    const temp = alarmShow;
    setAlarmShow(temp + 10);
  };

  CloseSidebar(closeRef);

  // localStorage의 JWT값 불러와 token state에 저장
  useEffect(() => {
    setToken(getToken());
  }, []);

  //마이페이지 routing
  const showProfile = () => {
    router.push(`/profile/${user}`);
  };

  //토큰 유효성 검사
  useEffect(() => {
    if (token) {
      getUserData()
        .then((res) => {
          setUser(res.data.user.id);
          setUserProfile(res.data.user.profilePath);
        })
        .catch((err) => {
          window.localStorage.removeItem('jwt');
          window.location.reload();
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) getAlarmData();
  }, [token]);

  //알람 열람
  const alarmOpen = () => {
    setIsAlarmOpen(!isAlarmOpen);
  };

  return (
    <header className={styles.container}>
      <nav>
        <div className={styles.myHeader} ref={closeRef}>
          <Link href="/" passHref>
            <img
              alt="동그라미"
              src="https://lovelyoch.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fcfb255ff-10a0-4095-aabb-3b0c62e1ebf6%2Flogo-removebg.png?table=block&id=58d3c93f-aa6e-4b62-9c49-df57fae3f5fe&spaceId=69eb8ea8-3d04-47ec-8bb7-004e8aa31f9e&width=2000&userId=&cache=v2"
            />
          </Link>
          <Hamburger rounded toggled={open} toggle={setOpen} size={25} />
          <div className={styles.topMenu}>
            <ul className={styles.menus} id={open ? styles.show : styles.hide}>
              <HeaderMobileBoard />
              <HeaderBoard />
            </ul>
            {token ? (
              <div
                className={styles.tokenIcons}
                id={open ? styles.show : styles.hide}
              >
                <div className={styles.alarm}>
                  <div className={styles.bell} onClick={alarmOpen}>
                    {alarmList.length > 0 && (
                      <div className={styles.count}>
                        {alarmList.length <= 99 ? (
                          <span>{alarmList.length}</span>
                        ) : (
                          <span>99+</span>
                        )}
                      </div>
                    )}
                    <BiBell />
                  </div>
                  {isAlarmOpen && (
                    <AlarmContainer
                      alarmList={alarmList}
                      showMoreAlarm={showMoreAlarm}
                      onAlarmDeleteAll={onAlarmDeleteAll}
                      onAlarmPatch={onAlarmPatch}
                      alarmShow={alarmShow}
                      getAlarmData={getAlarmData}
                    />
                  )}
                </div>
                <div className={styles.profileWrap}>
                  {userProflie ? (
                    <img
                      alt="유저 프로필"
                      src={userProflie}
                      className={styles.userProflie}
                      onClick={showProfile}
                    />
                  ) : (
                    <FaUserCircle
                      className={styles.Profile}
                      onClick={showProfile}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div
                className={styles.users}
                id={open ? styles.show : styles.hide}
              >
                <HeaderUser />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
