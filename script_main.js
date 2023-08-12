let location_ = '(서울)';
let date = today();
let video = 'r';
let buttons = null;
let raceNum = null;
let videoJson = null;
let toglel = 0;
let presetDate = null;



let selectedDate = null;
let noRace = document.querySelector('.noRace');
let params = (new URL(document.location)).searchParams; 
let race = params.get("race"); // 웹사이트 파라미터 ?race="2023.08.22_s1r" 형식으로 전달


const result_button = document.querySelector('#result-show-button');
const result_content = document.querySelector('#result-content');
const calendar_switch = document.querySelector('#calendar-switch');
const calenderElement =  document.querySelector('.calendar');


if (race !== null) {
    video = race[race.length - 1]; // 문자열 "2023.08.22_s1r" 에서 r 추출
    date = race.split('_')[0]; // "2023.08.22_s1r" 에서 "2023.08.22" 추출
    raceNum = race.split('_')[1].replace(/\D/g, ''); // "s1r" 에서 숫자만 남기고 문자 제거

    let initial = race.split('_')[1][0]; // "2023.08.22_s1r" 에서 s(지역) 추출
    if (initial === 's'){
        changeLocation('(서울)');
    }
    else if (initial === 'b'){
        changeLocation('(부산)');
    }
    else if (initial === 'j'){
        changeLocation('(제주)');
    }
    
    let newdate = `${location_} ${date}`;
    console.log(newdate)
    
    let raceBtns = document.querySelectorAll('#raceBtn')  // 경주 버튼들을 가져온 뒤 
    for (let i = 0; i <= raceBtns.length-1; i++){
            raceBtns[i].style.backgroundColor = ''; // 색깔 없애고
        };

    // 자바스크립트 변수에 날짜 저장
    presetDate = {
        year: parseInt(date.split('.')[0]),
        month: parseInt(date.split('.')[1]), // 숫자로 저장
        day: parseInt(date.split('.')[2])
    };
    
    
    
    toggle = 1;
    start(date)


}

function today(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); 
    var day = ("0" + date.getDate()).slice(-2); 
    var formattedDate = year + '.' + month + '.' + day;
    return formattedDate; // Output: "2023.08.04"
} 


function changeVideo(videoId, number) {
    //result_content.style.display = 'none';
    let race_table = document.querySelector(".result-table");
    let race_date = document.querySelector("#date");
    let race_name = document.querySelector("#rname");
    let race_distance = document.querySelector("#distance");
    let race_grade = document.querySelector("#grade");
    let race_age = document.querySelector("#age");
    let race_budam = document.querySelector("#budam");
    let race_track = document.querySelector("#track");
    let race_weather = document.querySelector("#weather");
    race_table.innerHTML = '';
    document.getElementById('ytplayer').src = `https://www.youtube.com/embed/${videoId}?vq=hd1080&rel=0`;
    let race_key = document.querySelector("#result").value+' '+document.querySelector(`.raceNumBtn-${number}`).textContent.match(/\d+/)[0];
    console.log("레이스 키 : ", race_key)

    fetch(`https://kraserver.pythonanywhere.com/get-data?key=${race_key}`, {
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        for (let key in data) {
            if (key.includes(race_key)) {

                race_date.innerText = key+'경주';
                race_name.innerText = data[key][0]["race_name"]
                race_distance.innerText = data[key][0]["race_distance"]+'m'
                race_grade.innerText = data[key][0]["grade"]
                race_age.innerText = data[key][0]["age_condition"]
                race_budam.innerText = data[key][0]["budam_condition"]
                race_track.innerText = data[key][0]["track_condition"]
                race_weather.innerText = data[key][0]["weather"]

                for (let i = 1; i < data[key].length; i++){

                    let rank = data[key][i]["rank"];
                    let horse_number = data[key][i]["horse_number"];
                    //let number_img_url = `./img/${horse_number}_n.png`;
                    let horse_name = data[key][i]["horse_name"];
                    let jackey_name = data[key][i]["jackey_name"];
                    let difference = data[key][i]["difference"];
                    let record = data[key][i]["record"];
                    let dan = data[key][i]["dan"];
                    let yun = data[key][i]["yun"];
                    let hadicap = data[key][i]["hadicap"];
                    let horse_weight = data[key][i]["horse_weight"];
                    let horse_age = data[key][i]["horse_age"];


                    race_table.insertAdjacentHTML('beforeend', `
                    <tr>
                        <td style="text-align:center;">${rank}</td> 
                        <td>\t\n<img src="./img/${horse_number}_n.png" style="width:20px">  ${horse_name}</td>
                        <td>${jackey_name}</td>
                        <td>${difference}</td>
                        <td>${record}</td>
                        <td>${dan}</td>
                        <td>${yun}</td>
                        <td>${hadicap}</td>
                        <td>${horse_weight}</td>
                        <td>${horse_age}</td>
                    </td>`);
                }
            }       
        }
          
        
      })
      .catch(error => {
          console.error('Error:', error);
      });       
}




result_button.addEventListener('click', function() {
    if (result_content.style.display === 'none' || result_content.style.display === '') {
        result_content.style.display = 'block';
        result_button.innerHTML = '접기 ▲';
        result_button.style.color = '#1d2a19'
    } else {
        result_content.style.display = 'none';
        result_button.innerHTML = '<img class="result-img" src="img/result-img.png"> 결과보기 <span class="click">(Click)</span>';
        result_button.style.color = '#1d2a19'
    }
});



calendar_switch.addEventListener('click', function() {
    if (calenderElement.style.display === 'none' || calenderElement.style.display === '') {
        calenderElement.style.display = 'block';
        calendar_switch.innerHTML = "접기▲"
    } else {
        calenderElement.style.display = 'none';
        calendar_switch.innerHTML = "펼치기▼"
    }
});




function result_show(){
    
}


function changeLocation(loc) {
    location_ = loc;
    
    if (location_ === '(서울)'){
        document.querySelector('#seoul').className += " active";
        document.querySelector('#busan').className = 'locationBtn';
        document.querySelector('#jeju').className = 'locationBtn';
    }
    else if (location_ === '(부산)'){
        document.querySelector('#busan').className += " active";
        document.querySelector('#seoul').className = 'locationBtn';;
        document.querySelector('#jeju').className = 'locationBtn';
    }
    else if (location_ === '(제주)'){
        document.querySelector('#jeju').className += " active";
        document.querySelector('#busan').className = 'locationBtn';
        document.querySelector('#seoul').className = 'locationBtn';
    }
    
    document.querySelector("#result").value = "날짜를 선택하세요.";
    let btnElements = document.querySelectorAll('#raceBtn');
        for (let i = 0; i <= btnElements.length-1; i++){
            btnElements[i].style.display = 'none';
        };
}


function raceBtnRenderer(date){
    
    fetch(`https://kraserver.pythonanywhere.com/get-video?key=${date}`, {
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        for (let key in data) {
            if (key.includes(date)) {
                num = key.split(" ").pop(); // (서울) 2023.08.06 1에서 제일 마지막 : 1
                let videoBtn = document.querySelector(`.raceNumBtn-${num}`); // num : 경주번호
                videoBtn.style.display = 'block'; // 버튼 생성
                let videoURL = data[key]; // 버튼에 비디오URL 부여
                var temp = new URL(videoURL, 'http://dummy.com');
                var videoID = temp.searchParams.get("v");
                console.log('비디오 아이디',videoID);
                videoBtn.setAttribute('onclick', `changeVideo("${videoID}",${num})`); // 버튼에 onclick 속성 부여
                noRace.style.display = 'none'; //"경주가 없습니다" 문구 제거
            }
        }
    buttons = document.querySelectorAll('[id="raceBtn"]'); // 모든 경주 버튼 가져오기
    var selectedButton;
    for(var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(event) {
            if (selectedButton) selectedButton.style.backgroundColor = '';  // Reset the color of the previously clicked button
            selectedButton = event.target;  // Update the selected button
            selectedButton.style.backgroundColor = '#fcb9c0';  // Change the color of the clicked button
        });
    }
    let button = document.querySelector(`.raceNumBtn-${raceNum}`);
//    button.style.backgroundColor = '#fcb9c0';
    if (toggle === 1){
        button.click();  // 자동 클릭
        toggle = 0;
    }
   
    let rbuttons = document.querySelectorAll('.raceNumBtn');
    rbuttons.forEach(btn => {
        if (btn !== button) {
            btn.style.backgroundColor = '';
        }
    });
        
    

    });
}

function setDate(dateString) {
    console.log(dateString)
    start(dateString)
}




function run(date){
    

    setDateDropdown(date)

    
    console.log("체크체크체킃")
    
        // 월, 화, 수, 목의 th 요소 선택
    let thElements = document.querySelectorAll('.rd-days-row th.rd-day-head:nth-child(-n+5):nth-child(n+2)');
    thElements.forEach(function(th) {
        th.style.color = '#d3d2d2';
    });

    // 월, 화, 수, 목의 td 요소 선택 (날짜들)
    let tdElements = document.querySelectorAll('.rd-days-row td.rd-day-body:nth-child(-n+5):nth-child(n+2)');
    tdElements.forEach(function(td) {
        td.style.color = '#d3d2d2';
    });
    // 현재 보여지는 버튼들 모두 제거
    let btnElements = document.querySelectorAll('#raceBtn'); 
    for (let i = 0; i <= btnElements.length-1; i++){
        btnElements[i].style.backgroundColor = '';
        btnElements[i].style.display = 'none';
    };
    
    noRace.style.display = 'block'; // "경주가 없습니다. 문구 삽입"
    result.value = date;
    selectedDate = document.querySelector("#result").value; // 
    let selectedDate_L = `${location_} ${selectedDate}`; //'(서울) 2023.08.22' <- 지역 삽입
    document.querySelector("#result").value = selectedDate_L; //'id = result 요소에 '(서울) 2023.08.22' <- 지역 삽입
    raceBtnRenderer(selectedDate_L);

}

function start(date) {


    var calendar = rome(inline_cal, {time: false, inputFormat: 'YYYY.MM.DD'});
    calendar.on('data', run);   
    if (date !== null) {
        calendar.setValue(date);
        run(date);
    }
};






function adjustDays() {
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    let daysInMonth;

    // 초기화: 모든 옵션을 일 선택자에서 제거
    while(daySelect.firstChild) {
        daySelect.removeChild(daySelect.firstChild);
    }

    // 기본 선택 옵션 추가
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.text = "선택"; 
    daySelect.appendChild(defaultOption);

    switch(month) {
        case 2:
            daysInMonth = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
            break;
        case 4: case 6: case 9: case 11:
            daysInMonth = 30;
            break;
        default:
            daysInMonth = 31;
    }

    // 필요한 일 옵션 추가
    for(let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = String(i).padStart(2, '0');
        option.text = String(i) + "일"; 
        daySelect.appendChild(option);
    }
}


// 페이지 로드 시 날짜 조절 함수 실행
document.addEventListener('DOMContentLoaded', function() {
    adjustDays();

    // 저장한 날짜로 드롭다운 메뉴 설정
    document.getElementById('year').value = presetDate.year;
    document.getElementById('month').value = presetDate.month;  // 월을 숫자 형태로 설정
    adjustDays(); 
    document.getElementById('day').value = String(presetDate.day).padStart(2, '0');
});

document.getElementById('day').addEventListener('change', function() {
    const year = document.getElementById('year').value;
    const month = String(document.getElementById('month').value).padStart(2, '0');
    const day = String(document.getElementById('day').value).padStart(2, '0');
    const formattedDate = `${year}.${month}.${day}`;
    setDate(formattedDate);
});


let toss = 0;

function setDateDropdown(dateString) {
    
    // 문자열을 "."을 기준으로 나누어 연, 월, 일을 추출
    const [year, month, day] = dateString.split(".");
    
    // 각 값들을 드롭다운에 설정
    document.getElementById('year').value = year;
    document.getElementById('month').value = parseInt(month); // 월은 숫자 형태로 저장되어 있기 때문에 정수로 변환
    //adjustDays();  // "월"이 바뀌었기 때문에 "일" 드롭다운 옵션을 조절
    document.getElementById('day').value = day;
}

