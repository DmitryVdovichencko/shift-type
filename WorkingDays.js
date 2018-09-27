//Скрипт для расчета текущего графика при непрерывной рабочей неделе










function shiftType(myDate,teamNum,typeNum){
  //Готовим массивы рабочих смен для разных графиков
  function arrSel(selector){
  /* Функция для циклического сдвига массива на к шагов. Используется метод splice для отсечки массива с конца,
   а затем метод concat для объединения с оставшейся частью массива.
   Чтобы исходный массив не изменялся используем метод slice()*/
    function arrShift(baseArr,k){
      var arr=baseArr.slice();
      arr=arr.splice(-k).concat(arr);
      return arr;
    }

    switch(selector){
      case 1:
        /* Четырехбригадный график сменности при непрерывной рабочей неделе и 11,5 часовой рабочей смене
        Смена 1 с 8:00 до 20:00
        Смена 2 с 20:00 до 24:00
        Смена 3 с 24:00 до 8:00
        Смена 4 Выходной
        */
        var arr2=["с утра", "в ночь", "отсыпной", "выходной" ];
        var arr=[arrShift(arr2,2), arr2, arrShift(arr2,1), arrShift(arr2,3)];
        
        break;
      case 2:
        /* Четырехбригадный график сменности при непрерывной рабочей неделе и 7,5 часовой рабочей смене
        Смена 1 с 0:00 до 8:00
        Смена 2 с 8:00 до 16:00
        Смена 3 с 16:00 до 24:00
        Смена 4 Выходной
        */
        var arr4=[];
        for (var j = 0; j < 15; j=(j+5)) {
          for (var i = j; i < (j+5); i++) {
            if (i<4){arr4[i]=1;}
            if ((i>4)&&(i<10)){arr4[i]=2;}
            if (i>9){arr4[i]=3;}
            if((i+1)%5===0){arr4[i]=4;}  
          }
        }
        arr4[arr4.length]=4;
        arr=[arrShift(arr4,-4),arrShift(arr4,8),arrShift(arr4,4), arr4]
        
        break;


    }

    return arr;
  }

/*Вычисляем остаток от деления количества дней с 1.01.1970 на 4.
Поскольку цикл смен повторяется через 4 дня это значение определит тип смены для каждой из бригад.*/
let arr=arrSel(1);
console.log("current array is " + arr);
let shiftNum = (~~(+myDate/(1000*3600*24)))%arr[0].length, shiftType=arr[teamNum-1][shiftNum];
console.log("shiftType" + shiftType);
return shiftType;
}
