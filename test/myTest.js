
//отключается play() во время теста,нет доступа чтения к этой функции
describe("Restar level", function() {
    it(" its true, if function finised succes", function(){
        var res =restartGame(1);
        expect(res).toBeTruthy();//получить true
        // в случаи выполнении функции
    });
});


describe("create Ground", function() {
    it(" Return new ground", function(){
        var body= createGround(100, 100, 0, 0, 0, 1, null);
        expect(body).toBeDefined();//значение должно быть определено
    });
});

describe ("movePerson",function(){

    it("Make less score", function(){
         var start=myGame.score;
        movePerson( RIGHT,  myGame.STEP_DISTANCE_ON_AIR);
        expect(myGame.score).toBeLessThan(start);//персонаж прыгнул,значки очков стало меньше чем в начале игры
    });

});

describe ("createPersonAt",function(){
        it("create a box", function(){
        var person=createPersonAt(10,10);
        expect(person).toBeDefined();//персонаж должен быть определен
    });

});

describe ("createWorld",function(){
    it("world must be define", function(){
        var ourWorld=createWorld();
        expect(ourWorld).toBeDefined();//мир должен быть определен и создан
    });

});








