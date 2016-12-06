var thinFilmApp = angular.module('thinFilmApp', []);

thinFilmApp.controller('mainController', function ($scope) {

});

thinFilmApp.controller('gridController', function ($scope) {

    $scope.editedRowIndex = -1;
    $scope.layers = [new Layer('', 1.2, 0.4)];

    $scope.addRow = function () {
        $scope.layers.push(new Layer());
    };

    $scope.editRow = function (editedRowIndex) {
        $scope.editedRowIndex = editedRowIndex;
    };
    $scope.commitRow = function () {
        $scope.editedRowIndex = -1;
    };

    $scope.calculate = function () {

        var N_IN = 1;
        var N_OUT = 1.5;
        var i1 = math.complex(0, 1);
        var matrix = null;

        for (var i = 0; i < $scope.layers.length; i++) {
            var layer = $scope.layers[i];
            var refractiveIndex = +layer.refraction;
            var thickness = +layer.thickness;

            var lambda = thickness; //TODO use real n*d

            var phi0 = 2 * Math.PI * thickness / lambda;
            var cosPhi0 = Math.cos(phi0);
            var sinPhi0 = Math.sin(phi0);
            console.log(cosPhi0);

            var m = [[0, math.complex(0, 1 / refractiveIndex)], [math.complex(0, refractiveIndex), 0]];
            matrix = matrix ? math.multiply(matrix, m) : m;
        }

        var r0 = math.add(math.multiply(N_IN, matrix[0][0]), math.multiply(i1, refractiveIndex, matrix[0][1]));
        var r1 = math.add(math.multiply(N_OUT, matrix[1][1]), math.multiply(i1, matrix[1][0]));

        var rMinus = math.add(r0, math.multiply(-1, r1));
        var rSum = math.add(r0, r1);

        $scope.result = (Math.pow(rMinus.re, 2) + Math.pow(rMinus.im, 2)) / (Math.pow(rSum.re, 2) + Math.pow(rSum.im, 2));
        $scope.resultIsReady = true;
    }

});

function Layer(material, refraction, thickness) {
    this.material = material || 'Air';
    this.refraction = refraction || 1.0;
    this.thickness = thickness || 0.5;
}