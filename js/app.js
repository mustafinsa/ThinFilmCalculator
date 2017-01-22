var thinFilmApp = angular.module('thinFilmApp', []);

function gridController($scope, thinFilmService) {

    $scope.editedRowIndex = -1;
    $scope.layers = [new Layer('', 1.2, 0.4)];
    $scope.lambda0 = 550;
    $scope.lambda = 550;

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
        $scope.result = thinFilmService.calculate($scope.layers, $scope.lambda0, $scope.lambda);
        $scope.resultIsReady = true;
    };
}

thinFilmApp.controller('gridController', gridController);
thinFilmApp.service('thinFilmService', thinFilmService);

function thinFilmService() {
    this.calculate = function (layers, lambda0, lambda) {
        var N_IN = 1;
        var N_OUT = 1.5;
        var i1 = math.complex(0, 1);
        var matrix = null;

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var refractiveIndex = +(layer.refraction);
            var thickness = +(layer.thickness);

            var d = thickness * lambda0 / refractiveIndex;

            var phi0 = 2 * Math.PI * refractiveIndex * d / lambda;
            var cosPhi0 = Math.cos(phi0);
            var sinPhi0 = Math.sin(phi0);

            var m = [[cosPhi0, math.complex(0, sinPhi0 / refractiveIndex)], [math.complex(0, sinPhi0 * refractiveIndex), cosPhi0]];
            matrix = matrix ? math.multiply(matrix, m) : m;
        }

        var r0 = math.add(math.multiply(N_IN, matrix[0][0]), math.multiply(i1, N_OUT, matrix[0][1]));
        var r1 = math.add(math.multiply(N_OUT, matrix[1][1]), math.multiply(i1, matrix[1][0]));

        var rMinus = math.add(r0, math.multiply(-1, r1));
        var rSum = math.add(r0, r1);

        var numerator = Math.pow(rMinus.re, 2) + Math.pow(rMinus.im, 2);
        var denominator = Math.pow(rSum.re, 2) + Math.pow(rSum.im, 2);
        return numerator / denominator;
    }
}

function Layer(material, refraction, thickness) {
    this.material = material || 'Air';
    this.refraction = refraction || 1.0;
    this.thickness = thickness || 0.5;
}