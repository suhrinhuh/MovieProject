import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Boxoffice() {
  const [ dailyMovies, setDailyMovies ] = useState([]);
  // const [ weeklyMovies, setWeeklyMovies ] = useState([])

  const [ isLoading, setIsLoading ] = useState(true);


  // 현재 날짜 기준 7일 전의 날짜로 설정
  const getSevenDaysAgoDate = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
    const year = sevenDaysAgo.getFullYear();
    const month = String(sevenDaysAgo.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(sevenDaysAgo.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };



  // 초기 렌더링시에 API로 데이터 불러오기
  useEffect(() => {
    // fetchData 함수 정의
    const fetchData = async () => {
      const date = getSevenDaysAgoDate()

      try {
        const dailyResponse = await axios.get('https://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json',{
          params: {
            key: process.env.REACT_APP_VITE_BOXOFFICE_API_KEY,
            targetDt: date,
            itemPerPage: 5,
            multiMovieYn: 'N',
          }
        });
        console.log(dailyResponse.data);
        // 이 표현 익혀두자!
        if (dailyResponse.data?.boxOfficeResult?.dailyBoxOfficeList) {
          setDailyMovies(dailyResponse.data.boxOfficeResult.dailyBoxOfficeList)
        } else {
          console.error('Error occurs')
        }
      } catch (error) {
        console.error('Error occurs',error)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  },[])



  return(
    <div>
      <h1>Daily Box Office</h1>
      { isLoading ? (
        <h5>Loading...</h5>
        ):(
        <ul>
        {dailyMovies.map((movie, index) => (
          <li key={index}>{movie.movieNm}</li>
        ))}
      </ul>
    )}
      
    </div>
  )
}

export default Boxoffice;