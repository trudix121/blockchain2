document.addEventListener("DOMContentLoaded", function() {
  let level = document.getElementById("level");
  const btn_start = document.getElementById("btn_start");
  const guess = document.getElementById("guess_number");
  const hint = document.getElementById("hint");
  const numberDisplay = document.getElementById('number');
  const h1_guess = document.getElementById('h1_guess');
  const guess_btn = document.getElementById('guess_btn');
  const play_again = document.getElementById('play_again');
  const play_no = document.getElementById('play_no');
  const play_yes = document.getElementById('play_yes');
  const level2 = document.getElementsByClassName('level');
  
  const easy_info = ["3", "2", 0, 5];
  const medium_info = ["5", "5", 0, 10];
  const hard_info = ["10", "10", 0, 20];
  let main = null;
  
  
  function reset_game(level) {
      // Implementați funcționalitatea de resetare a jocuui
      numberDisplay.style.display = 'none';
      change = level[0]
    }

  function play_again1(level) {
      play_yes.addEventListener('click', () => {
  numberDisplay.style.display = 'none'; // Afișează elementul numberDisplay
  guess.style.display = 'none';
  hint.style.display = 'none';
        guess_btn.style.display = 'none';
        h1_guess.style.display = 'none';
        play_no.style.display = 'none';
        play_yes.style.display = 'none';
        play_again.style.display = 'none';
    
        level2[0].style.display = 'block';
        btn_start.style.display = 'block';
    
        reset_game(level);
        numberDisplay.style.display = 'block'; // Afiseaza elementul numberDisplay
      });
      play_no.addEventListener('click', () => {
        guess.style.display = 'none';
        hint.style.display = 'none';
        numberDisplay.style.display = 'none';
        guess_btn.style.display = 'none';
        h1_guess.style.display = 'none';
        play_no.style.display = 'none';
        play_yes.style.display = 'none';
        play_again.style.display = 'none';
      });
    }
    
    
  
  function add_ethm(level) {
    const data = { ethm: level[1] };
  
    fetch(`http://localhost:3000/games/ng/add?username=${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
      })
      .catch(error => {
        console.error(error);
      });
  }
  let change;
  function game(level) {
    const randomNumber = randomIntFromInterval(level[2], level[3]);
    chance = level[0];
    guess_btn.addEventListener('click', (event) => {
      let number = guess.value;
      hint.style.display = 'grid';
      if (number > randomNumber) {
        hint.innerHTML = 'Your number is high';
        chance -= 1;
      } else {
        hint.innerHTML = 'Your number is lower';
        chance -= 1;
      }
      if (number == randomNumber) {
        hint.innerHTML = 'You won';
        setTimeout(() => {
          hint.style.display = 'none';
          play_again.style.display = 'block';
          play_yes.style.display = 'block';
          play_no.style.display = 'block';
          play_again.innerHTML = 'You Win! Play Again';
          guess_btn.style.display = 'none';

          play_again1(level);
          add_ethm(level);
        }, 1000);
      }
      if (chance == 0) {
        hint.innerHTML = 'You lose';
        setTimeout(() => {
          hint.style.display = 'none';
          play_again.style.display = 'block';
          play_yes.style.display = 'block';
          play_no.style.display = 'block';
        }, 1000);
  
        guess_btn.style.display = 'none';
  
        play_again1(level);
      }
    });
  }
  
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  btn_start.addEventListener("click", (event) => {
    event.preventDefault();
    if (level.value === "easy") {
      numberDisplay.innerHTML = `Number: ${easy_info[2]}, ${easy_info[3]}`;
      h1_guess.style.display = 'grid';
      btn_start.style.display = 'none';
      guess_btn.style.display = 'grid';
      guess.style.display = 'grid';
      level.style.display = 'none';
      main = easy_info;
    }
    if (level.value === "medium") {
      h1_guess.style.display = 'grid';
      btn_start.style.display = 'none';
      guess_btn.style.display = 'grid';
      guess.style.display = 'grid';
      level.style.display = 'none';
      numberDisplay.innerHTML = `Number: ${medium_info[2]}, ${medium_info[3]}`;
      main = medium_info;
    }
    if (level.value === "hard") {
      h1_guess.style.display = 'grid';
      numberDisplay.innerHTML = `Number: ${hard_info[2]}, ${hard_info[3]}`;
      btn_start.style.display = 'none';
      guess_btn.style.display = 'grid';
      guess.style.display = 'grid';
      level.style.display = 'none';
      main = hard_info;
    }
    game(main);
  });
});