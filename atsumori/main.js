/* 森田さん */
let img_mori;
let NUM = 1000; //出現数
let moritas = new Array(NUM); //部屋
let flag_hit_moritas = new Array(NUM); //当たり判定フラグ
let diameter; //サイズ
let c; //色

/*　プレイヤー */
let img_player;
let count_hit; //当たった数
let size_player = 100; //サイズ
let size_hit = size_player * 0.6; //当たり判定サイズ

/* ゲーム全体 */
let font;
let img_bg;
let width_br = window.innerWidth;
let height_br = window.innerHeight; //ブラウザのサイズ
let START = -1,
  PLAY = 0,
  FIN = 1,
  OVER = 2;
let flag_scene;
let c_text = 0;

/* サウンド */
let sound_start, sound_kakin, sound_hit;

/* ボタン width_br/2,height_br/2, 120,50 */
let width_bp = 360,
  height_bp = 120;
let x_bp = width_br / 2,
  y_bp = height_br / 2;

/*　タイマー */
let time = 10; //ゲームの残り時間
let count_time;
let count_frame;
let time_fin; //終了画面の表示時間
let count_time_fin;

/* 課金 */
let flag_kakin = false;

function preload() {
  //画像の読込
  img_player = loadImage("./hand.png");
  img_bg = loadImage("./bg.png");
  img_mori = loadImage("./taruki.png");

  //フォントの読込
  font = loadFont("./CP_Revenge.ttf");

  //サウンドの読込
  sound_start = loadSound("./sound/start.mp3");
  sound_kakin = loadSound("./sound/kakin.mp3");
  sound_hit = loadSound("./sound/hit.mp3");
}

function setup() {
  createCanvas(width_br, height_br, P2D);
  colorMode(HSB, 360, 100, 100, 100);
  blendMode(BLEND);

  frameRate(60);
  rectMode(CENTER);

  textFont(font);
  textSize(120);

  strokeWeight(3);
  strokeJoin(ROUND);
  stroke(255, 0, 0);

  //最初にスタート画面の表示
  flag_scene = START;
}

function draw() {
  background(img_bg);

  if (flag_scene == START) {
    start();
  } else if (flag_scene == PLAY) {
    play();
  } else if (flag_scene == FIN) {
    fin("GameClear!!");
  } else {
    fin("GameOver...");
  }
}

function start() {
  count_hit = 0;
  count_time = 0;
  count_frame = 0;
  time_fin = 5;
  count_time_fin = 0;

  //森田さんたちの読込
  for (let i = 0; i < NUM; i++) {
    moritas[i] = new Morita();
    flag_hit_moritas[i] = 0;
  }

  //タイトル
  textSize(100);
  fill(27, 100, 100);
  text(NUM + "匹あつめろ！", x_bp - width_bp * 1.2, 150);
  fill(139, 100, 82);
  text("どうぶつの森田さん", x_bp - width_bp * 1.2, 250);

  //ボタンの表示
  fill(120);
  strokeWeight(1);
  rect(x_bp, y_bp, width_bp, height_bp);
  fill(c_text);
  text("PLAY", x_bp - width_bp / 2, y_bp + height_bp / 3);
  //ボタン文字の表示
  fill(120);
  rect(x_bp, y_bp + height_bp + 10, width_bp, height_bp);
  fill(c_text);
  text("全森", x_bp - width_bp / 3.5, y_bp + height_bp * 1.25 + 20);

  strokeWeight(5);

  //課金額の表示
  if (flag_kakin) {
    textSize(70);
    fill(0, 100, 100);
    text(
      "全森モード解禁!\n手が大きくなるよ\n",
      x_bp - width_bp / 1.5,
      y_bp + height_bp * 2.2
    );
    textSize(120);
  }
}

//マウスが押されたら
function mousePressed() {
  //スタート
  if (
    checkRegion(mouseX, mouseY, x_bp, y_bp, width_bp, height_bp) &&
    flag_scene == START
  ) {
    sound_start.play();
    flag_scene = PLAY;
  }
  //全森
  if (
    checkRegion(
      mouseX,
      mouseY,
      x_bp,
      y_bp + height_bp + 10,
      width_bp,
      height_bp
    ) &&
    flag_scene == START
  ) {
    fill(c_text);
    sound_kakin.play();
    flag_kakin = true;
  }
}

function touchMoved() {
  //プレイ
  if (
    checkRegion(touchX, touchY, x_bp, y_bp, width_bp, height_bp) &&
    flag_scene == START
  ) {
    sound_start.play();
    flag_scene = PLAY;
  }
  //全森
  if (
    checkRegion(
      touchX,
      touchY,
      x_bp,
      y_bp + height_bp + 10,
      width_bp,
      height_bp
    ) &&
    flag_scene == START
  ) {
    fill(c_text);
    sound_kakin.play();
    flag_kakin = true;
  }

  // This prevents dragging screen around
  return false;
}

//ゲームのプレイ
function play() {
  count_frame++;
  if (count_frame % 60 == 0 && 0 < time - count_time) {
    count_time++;
  }
  if (0 == time - count_time) {
    flag_scene = OVER;
  }

  // 森田さんを描画
  for (let i = 0; i < NUM; i++) {
    if (flag_hit_moritas[i] == 0) {
      moritas[i].drawMorita();
      //森田さんの当たり判定
      if (
        checkRegion(
          mouseX,
          mouseY,
          moritas[i].pos.x,
          moritas[i].pos.y,
          size_hit,
          size_hit
        )
      ) {
        flag_hit_moritas[i] = 1;
        //sound_hit.play();
        count_hit++;
      }
    }
  }

  //課金したらサイズ変更
  if (flag_kakin) {
    size_player = 320;
    size_hit = size_player * 0.7;

    //残り3秒になったら元のサイズに変更
    if (3 >= time - count_time) {
      size_player = 100;
      size_hit = size_player * 0.7;
      fill(0, 100, 100);
      text("全森モード終了", 100, 200, 70, 220);
    }
  }

  //当たりカウント
  if (count_hit == NUM) {
    flag_scene = FIN;
  }
  fill(70, 100, 100);
  text(count_hit + "/" + NUM + "匹", 100, 100, 70, 200);

  //プレイヤーの表示
  image(img_player, mouseX, mouseY, size_player, size_player);

  //残り時間の表示
  fill(120);
  ellipse(width_br - 100, 60, 150);
  fill(c_text);
  text(time - count_time, width_br - 110, 110, 70, 200);
}

//終了画面
function fin(str) {
  //ゲームオーバー、クリアの表示
  fill(c_text);
  text(str, x_bp - width_bp, y_bp + height_bp / 2.5);

  //スタート画面に戻る
  count_frame++;
  if (count_frame % 60 == 0 && 0 < time_fin - count_time_fin) {
    count_time_fin++;
  }
  if (0 == time_fin - count_time_fin) {
    flag_scene = START;
  }
}

//当たり判定
function checkRegion(
  _x_play,
  _y_play,
  _x_target,
  _y_target,
  _width_target,
  _height_target
) {
  if (
    _x_target - _width_target * 0.5 < _x_play &&
    _x_play < _x_target + _width_target * 0.5 &&
    _y_target - _height_target * 0.5 < _y_play &&
    _y_play < _y_target + _height_target * 0.5
  ) {
    return true;
  } else {
    return false;
  }
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   //y = windowHeight/2;
// }

//森田さんクラス
class Morita {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.diameter = random(54, 120);
    this.c = color(random(360), 100, 100, random(100));
  }

  drawMorita() {
    fill(this.c);
    image(img_mori, this.pos.x, this.pos.y, this.diameter, this.diameter);
    this.pos.add(this.vel);

    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x = this.vel.x * -1;
    }

    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y = this.vel.y * -1;
    }
  }
}
