let location_ = '(서울)';
let date = today();
let video = 'r';
let buttons = null;
let raceNum = null;
let videoJson = null;


let selectedDate = null;
let noRace = document.querySelector('.noRace');
let params = (new URL(document.location)).searchParams; 
let race = params.get("race"); // 웹사이트 파라미터 ?race="2023.08.22_s1r" 형식으로 전달

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
    
    fetchData_video().then(data => {
        raceBtnRenderer(newdate)
        let button = document.querySelector(`.raceNumBtn-${raceNum}`);
        button.style.backgroundColor = '#fcb9c0';
        button.click();  // 자동 클릭


        let buttons = document.querySelectorAll('.raceNumBtn');
        buttons.forEach(btn => {
            if (btn !== button) {
                btn.style.backgroundColor = '';
            }
        });
    });
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

const result_button = document.querySelector('#result-show-button');
const result_content = document.querySelector('#result-content');


result_button.addEventListener('click', function() {
    if (result_content.style.display === 'none' || result_content.style.display === '') {
        result_content.style.display = 'block';
        result_button.textContent = '닫기 ▲';
    } else {
        result_content.style.display = 'none';
        result_button.textContent = '결과보기 ▼';
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

    for (let key in videoJson) {
        if (key.includes(date)) {         
            num = key.split(" ").pop();
            let videoBtn = document.querySelector(`.raceNumBtn-${num}`); 
            videoBtn.style.display = 'block'; 
            let videoURL = videoJson[key]; 
            var temp = new URL(videoURL, 'http://dummy.com');
            var videoID = temp.searchParams.get("v");
            console.log('비디오 아이디',videoID);
            videoBtn.setAttribute('onclick', `changeVideo("${videoID}",${num})`);
            noRace.style.display = 'none';
            }
    }
    buttons = document.querySelectorAll('[id="raceBtn"]');
    var selectedButton;
    for(var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(event) {
            if (selectedButton) selectedButton.style.backgroundColor = '';  // Reset the color of the previously clicked button
            selectedButton = event.target;  // Update the selected button
            selectedButton.style.backgroundColor = '#fcb9c0';  // Change the color of the clicked button
        });
    }

}



async function fetchData_video() {
    try {
        const response = await fetch('data.json?t=' + Date.now());
        videoJson = await response.json();
        return videoJson;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function run(date){
    
    let btnElements = document.querySelectorAll('#raceBtn');
    for (let i = 0; i <= btnElements.length-1; i++){
        btnElements[i].style.backgroundColor = '';
        btnElements[i].style.display = 'none';
    };

    noRace.style.display = 'block';
    result.value = date;
    selectedDate = document.querySelector("#result").value; // '2023.08.22' (달력에서 선택된 날짜)
    let selectedDate_L = `${location_} ${selectedDate}`; //'(서울) 2023.08.22' <- 지역 삽입
    document.querySelector("#result").value = selectedDate_L; //'id = result 요소에 '(서울) 2023.08.22' <- 지역 삽입
    if (videoJson === null){
        fetchData_video().then(data => {
            raceBtnRenderer(selectedDate_L);
        });
    }
    else{
            raceBtnRenderer(selectedDate_L);
    }

    

}

function start() {


    var calendar = rome(inline_cal, {time: false, inputFormat: 'YYYY.MM.DD'});
    calendar.on('data', run);   
    if (date !== null) {
        calendar.setValue(date);
        run(date);
    }
};

start()
