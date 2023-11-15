//I've tried to explain each JavaScript line with comments....Hope you'll understand

//selecting all required elements
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box");
let team_name_arr=[];
let team_name_auto_arr=[];
let runBot = true; //this also a global variable with boolen value..we used this variable to stop the bot once match won by someone or drawn

$('.setting_menu,.play_game_btn,.play-board,.select_team').hide();

$(document).on('click','.singleplayer',function(e){
    restart_game();
    $('.singleplayer').attr('single_player','on');
    $('.select_team').show();
});

$(document).on('click','.multiplayer',function(e){
    restart_game();
    $('.multiplayer').attr('multi_player','on');
    $('.select_team').show();
})

selectBtnX.onclick = ()=>{
    $('.play-area').attr('team','x');
    if($('.singleplayer').attr('single_player')=='on'){
        $('.Oturn').html('<i class="fa-solid fa-robot"></i> O\'s Turn');
        $('.play-area').attr('robot_team','o');
        $('.play-area').attr('robot_team_icon',playerOIcon);

    }
    
    
    $('.play-board').show();
}

selectBtnO.onclick = ()=>{ 
    $('.play-area').attr('team','o');
    if($('.singleplayer').attr('single_player')=='on'){
        $('.Xturn').html('<i class="fa-solid fa-robot"></i> X\'s Turn');
        $('.play-area').attr('robot_team','x');
        $('.play-area').attr('robot_team_icon',playerXIcon);


    }
    
    
    $('.play-board').show();
    players.setAttribute("class", "players active player"); //set class attribute in players with players active player values
}
// user click function
var team_array_count=0;click_count=0;
function clickedBox(element){
    click_count++;
    var single_player=$('.singleplayer').attr('single_player');
    if(team_name_arr.length==team_array_count){
        team_array_count=0;
    }
    playerSign=team_name_arr[team_array_count];
    if(team_name_arr.length==1 && click_count==2 && $('.multiplayer').attr('multi_player')=='on'){
        click_count=0;
        playerSign=$('.team_list:not(:checked)')[0].defaultValue;
    }
    team_array_count++;
    if(single_player=='on'){
        element.style.translateY="0px";

        playBoard.style.pointerEvents = "none"; //add pointerEvents none to playboard so user can't immediately click on any other box until bot select
        let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed(); //generating random number so bot will randomly delay to select unselected box
        setTimeout(()=>{
            bot(runBot); //calling bot function
        }, randomTimeDelay); //passing random delay value
    }
    $('.reset_active_btn').removeClass('active');
    team_icon=generate_icon(playerSign);
    element.innerHTML = team_icon; //adding circle icon tag inside user clicked element/box
    element.setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
    $('.'+playerSign+'turn').addClass(' active');
    element.style.pointerEvents = "none"; //once user select any box then that box can'be clicked again
    selectWinner(); //calling selectWinner function
}
// bot auto select function
function bot(){

    if(runBot){ //if runBot is true
        // console.log(team_name_auto_arr);
        var randombox_arr = $('.reset_box').filter(function() {
            return $.trim($(this).html()) === '';
        }).map(function() {
            return $(this).attr('class').replace('box', '').split(' ')[0];
        }).get();
        for(i=0;i<team_name_auto_arr.length;i++){
            $('.reset_active_btn').removeClass('active');
            playerSign=team_name_auto_arr[i];
            team_icon=generate_icon(playerSign);
            if(randombox_arr.length > 0){ //if array length is greater than 0
                for(j=0;j<=randombox_arr.length;j++){
                    let randomBox = randombox_arr[Math.floor(Math.random() * randombox_arr.length)];
                        if($('.box'+randomBox).html()==''){
                            $('.'+playerSign+'turn').addClass(' active');
                            randombox_arr.push((randomBox+1));
                            $('.box'+randomBox).html(team_icon) //adding cross icon tag inside bot selected element
                            $('.box'+randomBox).attr("id", playerSign); //set id attribute in span/box with player choosen sign
                            $('.box'+randomBox).css({'translateY':'0px','pointer-events':'none'});
                            break;
                        }
                }
                selectWinner(); //calling selectWinner function
            }
            playBoard.style.pointerEvents = "auto"; //add pointerEvents auto in playboard so user can again click on box
        }
    }
}

function getIdVal(classname){
    return document.querySelector(".box" + classname).id; //return id value
}
function checkIdSign(val1, val2, val3, sign){ //checking all id value is equal to sign (X or O) or not if yes then return true
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
}
function selectWinner(){ //if the one of following winning combination match then select the winner
    if(checkIdSign(1,2,3,playerSign) || checkIdSign(4,5,6, playerSign) || checkIdSign(7,8,9, playerSign) || checkIdSign(1,4,7, playerSign) || checkIdSign(2,5,8, playerSign) || checkIdSign(3,6,9, playerSign) || checkIdSign(1,5,9, playerSign) || checkIdSign(3,5,7, playerSign)){
        if($('.singleplayer').attr('single_player')=='on'){
            runBot = false; //passing the false boolen value to runBot so bot won't run again
            bot(runBot); //calling bot function
        }
        swal.fire({
            html:`<p style='font-size:50px;'>&#129395;</p>Player <b>${playerSign}</b> won the game`,
            allowOutsideClick:false,
            showCancelButton:false,
            confirmButtonText:'Restart',
        }).then((result)=>{
            restart_game();
        });
    }else{ //if all boxes/element have id value and still no one win then draw the match
        var emptyResetBoxes = $('.reset_box').filter(function() {
            return $.trim($(this).html()) === '';
        });
        if (emptyResetBoxes.length ==0) {
            if($('.singleplayer').attr('single_player')=='on'){
                runBot = false; //passing the false boolen value to runBot so bot won't run again
                bot(runBot); //calling bot function
            }
            swal.fire({
                html:`<p style='font-size:50px;'>&#128552;</p> Match has been drawn`,
                allowOutsideClick:false,
                showCancelButton:false,
                confirmButtonText:'Restart',
            }).then((result)=>{
                restart_game();
            });
        }
    }
}


var image_file_name=['city-park.jpg','forest-with-grass.jpg','playground2.jpg','vertical-shot.jpg',
'cascade-ban.jpg','vertical-shot.jpg','morskie-oko-tatry.jpg','wet-vietnam.jpg','wooden-bench-park.jpg','form-mountains.jpg','chinese-park.jpg','cascade-boat.jpg'];
image_file_name.forEach(function (src) {
    $addActiveClass='';
    if($('body').css('background-image').includes(src)){
        $addActiveClass='active';
    }
    $('.background_image_list').append('<img  class="all_background_image '+$addActiveClass+'" src=image/'+src+' alt="background_image" width="50" height="50"/>');
});
var game_image_file_name=['GameTemplate1.png','GameTemplate2.jpg','GameTemplate3.png','GameTemplate4.jpg','GameTemplate5.jpg','GameTemplate6.jpg','GameTemplate7.jpg','GameTemplate8.png','GameTemplate9.png','GameTemplate10.png'];
game_image_file_name.forEach(function (src) {
    $('.game_image_list').append('<img  class="all_game_background_image" src=image/gameteamplate/'+src+' alt="background_image" width="50" height="50"/>');
});
$(document).on('change','#background_color',function(e){
    var color=$(this).val();    
    $('body').css({'background-color':color,'background-image':'none'});
})
function restart_game(){
    $('.multiplayer').attr('multi_player','off');
    $('.singleplayer').attr('single_player','off');
    $('.select_team').hide();
    $('.reset_box').html('');
    $('.reset_box').css('pointer-events','auto');
    $('.play-board').hide();
    $('.Oturn').html('<i class="fa-solid fa-user"></i> O\'s Turn');
    $('.Xturn').html('<i class="fa-solid fa-user"></i> X\'s Turn');
    $('.reset_box').attr('id','');
    $('.background_image_list').html('');
    runBot = true;
    $('.setting_menu').hide();
    $('.select-box').show();
    $('.team_list').prop('checked',false);
    $('.play_game_btn').hide();
    team_name_arr=[];
    addTeamToPlay();
}

$(document).on('click','.all_background_image',function(e){
    var src=$(this).attr('src');
    $('body').css('background-image','url("'+src+'")');
});
$(document).on('click','.all_game_background_image',function(e){
    var src=$(this).attr('src');
    if(src='GameTemplate1.png'){
        $('.play-area section span').css({'border': 'none','margin':'2px','border-radius':'5px'});
        $('.play-area section').css({'margin-bottom':'1px','border': 'none', 'padding': '0px'});
    }else if(src='GameTemplate2.png'){
        $('.play-area section span').css({'border': '1px solid #e64d48'});
        $('.play-area section').css({'border': '1px solid #989c9d', 'padding': '5px'});
        $('.play-area').css({'border-radius': '10px','background': 'ghostwhite'});
    }else if(src='GameTemplate3.png'){
        $('.play-area section span').css({'border': '1px solid darkgrey','margin':'0px','border-radius':'0px'});
        $('.play-area section').css({'margin-bottom':'0px'});
    }
});

$(document).on('keypress change','.game_level_range',function(e){
    console.log($(this).val());
    addRowColumn($(this).val());
});

function addRowColumn(GameLevel){
    var game_play_content='';count=0;
    for(i=1;i<=(GameLevel*GameLevel);i++){
        count++
        if(count==1){
            game_play_content+=`<section>`;
        }
        game_play_content+=`<span onclick="clickedBox(this);" class="box${i} reset_box"></span>`;
        if(count==GameLevel){
            game_play_content+=`</section>`;
            count=0;
        }
    }
    $('.play-area').html(game_play_content);
}
addRowColumn(3);

$(document).on('click','.close_setting_icon,.back_to_home',function(e){
    restart_game();
})
$(document).on('click','.open_setting',function(e){
    $('.play-board').hide();
    $('.select-box').hide();
    $('.setting_menu').show();
})
function addTeamToPlay(){
    var team_selection_option='';
    for(i=0;i<$('.team_member .active').length;i++){
        var team_name=$('.team_member .active')[i].dataset.team_name;
        var team_icon=generate_icon(team_name);
        team_selection_option+=`<div class="btn btn-info text-white form-switch">
        <input style="margin-left:0px;"class="form-check-input team_list" type="checkbox" value="${team_name}" id="team_${team_name}">
        <label class="form-check-label" for="team_${team_name}">
          ${team_icon}
        </label>
      </div>`
    }
    $('.select_team .options').html(team_selection_option);
}
addTeamToPlay();
function generate_icon(team_name){
    if(team_name=='x'){
        return '<i style="color: #74a7f2;" class="fa-solid fa-x"></i>';
    }else if(team_name=='o'){
        return '<i style="color: #e75b49;" class="fa-solid fa-o"></i>';
    }else if(team_name=='s'){
        return '<i style="color: #d074f2;" class="fa-regular fa-square"></i>';
    }else if(team_name=='h'){
        return '<i style="color: #f53085;" class="fa-regular fa-heart"></i>';
    }else if(team_name=='st'){
        return '<i style="color: #8be749;" class="fa-regular fa-star"></i>';
    }
}
$(document).on('click','.team_list',function(e){
    if($('.team_list:checked').length!=0){
        $('.play_game_btn').show();
    }else{
        $('.play_game_btn').hide();
    }
});

$(document).on('click', '.set_team', function (e) {
  var clickedElement = $(this);
  var team_class = clickedElement.attr('class');
  var team_name = clickedElement.attr('data-team_name'); // Use 'data-' attribute for team name
  var title = '';

  if (team_class.includes('active')) {
    title = 'The team has successfully deactivated.';
    clickedElement.removeClass('active');
  } else {
    title = 'The team has successfully activated.';
    clickedElement.addClass('active');
  }

  Swal.fire({ icon: 'success', html: title });
});

$(document).on('click','.play_game_btn',function(e){
    var checked=0,Notchecked=0;
    checked=$('.team_list:checked').length;
    if($('.team_list:not(:checked)').length==0 && checked==0){
        swal.fire({icon:'info',text:'All teams are inactive; please activate another team. We need a maximum of two teams to play the game.'})
    }else if($('.team_list:not(:checked)').length==0){
        swal.fire({icon:'info',text:'Only one team is active; please activate another team. We need a maximum of two teams to play the game.'})
    }else{
        $('.team_list:checked').each(function() {
            team_name_arr.push($(this).val());
        });    
        if($('.singleplayer').attr('single_player')=='on'){
            Notchecked=$('.team_list:not(:checked)').length;
            $('.team_list:not(:checked)').each(function() {
                team_name_auto_arr.push($(this).val());
            });
        }
        total_row_column=3;
        if((checked+Notchecked)>2){
        total_row_column=(checked+Notchecked)+1;
        }
        addRowColumn(total_row_column);
        team_turn();
        $('.select-box').hide();
        $('.play-board').show();
        $('.reset_active_btn').removeClass('active');
        $('.'+team_name_arr[0]+'turn').addClass(' active');
    }
})
function team_turn(){
    var team_turn_content='';
    $('.team_list:checked').each(function() {
        team_turn_content+=`<span class="reset_active_btn ${$(this).val()}turn"><i class="fa-solid fa-user"></i> ${generate_icon($(this).val())} 's Turn</span>`;
    });
    if($('.singleplayer').attr('single_player')=='on'){
        $('.team_list:not(:checked)').each(function() {
            team_turn_content+=`<span class="reset_active_btn ${$(this).val()}turn"><i class="fa-solid fa-user"></i> ${generate_icon($(this).val())} 's Turn</span>`;
        });
    }else{
        team_name=$('.team_list:not(:checked)')[0].defaultValue;
        team_turn_content+=`<span class="reset_active_btn ${team_name}turn"><i class="fa-solid fa-user"></i> ${generate_icon(team_name)} 's Turn</span>`;
    }
    $('.players').html(team_turn_content);
}
