//Получаем объект canvas по имени id.
const canvas = document.getElementById("game");
//Далее, чтобы что то отображать, нам необходимо получить доступ к контесту рендеринга.
/*
Используя узел элемента canvas, получаем доступ к контексту рисования указываем формат игры 2d, так как мы используем 2д графику(т.е.для рисования фигур, текста, изображений и других объектов.).
Более подробно об интерфейсе CanvasRenderingContext2D, https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
* */
const ctx = canvas.getContext("2d");
/*
Используем конструктор Image() для работы с изображениями
https://developer.mozilla.org/ru/docs/Web/API/HTMLImageElement/Image
* */
//Изображения для бакграунда
const ground = new Image;
ground.src = "img/ground.png";

//Изображение для поля которое будет служить едой для змейки размер 32*32px
const foodImg = new Image;
foodImg.src = "img/food.png";

//Зададим переменную для размера поля на бэкграунде, которое будет служить местом положения для foodImg.
let box = 32;
//Общий счет игры
let score = 0;

/*
Ф-я которая будет возвращать рандомное целое значение значение координат для положения объекта по одной оси координат.
Передаем количество доступных ячеек по оси x(17) и по оси y (15) посчитали по картинке
Передаем размер самой ячейки для еды, foodImg
intervalOut - используем как параметр для отступа по краям поля, чтобы картинка еды не заходил за определенный край
* */
function getRandomIntPosition(max, boxParam, intervalOut=1 ) {
    //Math.random()* max + 1 - возвращаем значение от 0 до max переданного значения
    //Math.floor((Math.random()* max + 1)) * boxParam; - округляем до целого значение и умножаем на размер ячейки boxParam, который равен размеру foodImg
    return  Math.floor((Math.random()* max + intervalOut)) * boxParam;
}
let food = {
  x: getRandomIntPosition(17, box),
  y: getRandomIntPosition(15, box, 3),
};

let snake = [];
//начальное положение змейки по осям координат, примерно определяем по центру нашего поля
snake[0] = {
 x: 9 * box,
 y: 9 * box
};


//создадим обработчик событий, в этом обработчике будем вызывать ф-ю, которая будет обрабатывать события нажатия на клавиши клавиатуры
document.addEventListener("keydown", direction);

/*
* В данной ф-ии выполним ряд проверок для правилбой функциональности игры, т.е.
* if (event.keyCode == 37 && dir != "right") - если змейка движется влево, то она не может двигаться вправо и наоборот
* else if(event.keyCode == 38 && dir != "down") - если змейка начала движение вверх она не может двигаться вниз
* */
let dir;
function direction(event) {
    if(event.keyCode == 37 && dir != "right")
        dir = "left";
    else if(event.keyCode == 38 && dir != "down")
        dir = "up";
    else if(event.keyCode == 39 && dir != "left")
        dir = "right";
    else if(event.keyCode == 40 && dir != "up")
        dir = "down";
}

//Ф-я дял проверки не съедает ли змейка сама себя)) т.е. проверяем совпадения координат головы змейки со всеми кординатами змейки
function eatTail(head, arr) {
    for(let i = 0; i < arr.length; i++) {
        if(head.x == arr[i].x && head.y == arr[i].y)
            clearInterval(game);
    }
}

//напишем ф-ю, которая будет рисовать внутри canvas
function drawGame() {
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);

    for(let i=0; i < snake.length; i++){
       ctx.fillStyle = "green";//цвет фона
       ctx.fillRect(snake[i].x,snake[i].y, box, box);//отрисовываем квадрат для положения змейки
    }

    ctx.fillStyle="white";
    ctx.font ="50px Arial";
    ctx.fillText(score, box*2.5, box*1.7);


    //координаты объекта для первого элемента в массиве
    let snakeX=snake[0].x;
    let snakeY=snake[0].y;

    if(snakeX == food.x && snakeY == food.y){
        score++;
        food ={
            x: getRandomIntPosition(17, box),
            y: getRandomIntPosition(15, box, 3),
        }
    }else{
        // Удаляем последний элемент в массиве. т.е. удвляем старое положение змейки
        snake.pop();
    }


    /*Также перед нажатием клавиш сделаем проверку не достигла ли змейка края координат, то мы останавливаем игру
    *
    * */
    if(snakeX < box || snakeX > box *17 || snakeY < 3 * box || snakeY>box * 17) clearInterval(game);

    // Проверяем какая была нажата клавиша и соответственно смещаем координаты на размер ячейки в поле.
    if(dir == "left") snakeX -= box;
    if(dir == "right") snakeX += box;
    if(dir == "up") snakeY -= box;
    if(dir == "down") snakeY += box;
    //Координаты нового положения змейки
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    eatTail(newHead,snake);


    //Новый элемент помещаем в новые координаты, т.е. записываем координаты в начало массива
    snake.unshift(newHead);
}


//для отрисовки изображения будем вызывать ф-ю drawGame() каждые 100 милисек
let game = setInterval(drawGame, 300);

