(function () {
    var _module = angular.module('SlideBox', []);
    _module.factory('SlideBox', function ($ionicSlideBoxDelegate) {
        function _InfiniteSlideBox(handleName) {
            var _self = this;
            this.__proto__ = $ionicSlideBoxDelegate.$getByHandle(handleName);
            var getColor = function (nr) {
                return nr % 2 === 0 ? '#8080c5' : '#80b280';
            };

            var makeSlide = function (nr, data) {
                return angular.extend(data, {
                    nr: nr
                });
            };

            var
                default_slides_indexes = [-1, 0, 1],
                default_slides = [
      makeSlide(default_slides_indexes[0], {
                        title: 'default slide',
                        get color() {
                            return getColor(this.nr)
                        }
                    }),
      makeSlide(default_slides_indexes[1], {
                        title: 'default slide',
                        get color() {
                            return getColor(this.nr)
                        }
                    }),
      makeSlide(default_slides_indexes[2], {
                        title: 'default slide',
                        get color() {
                            return getColor(this.nr)
                        }
                    })
    ];
            _self.slides = angular.copy(default_slides);
            _self.selectedSlide = 0; // initial

            _self.showDetails = function () {
                $ionicPopup.alert({
                    title: 'Current Slides',
                    subTitle: 'currentIndex is ' + '<b>' + $ionicSlideBoxDelegate.currentIndex() + '</b>',
                    template: '<pre>' + $filter('json')(_self.slides) + '</pre>'
                });
            };
            _self.showDefaultSlides = function () {
                var
                    i = $ionicSlideBoxDelegate.currentIndex(),
                    previous_index = i === 0 ? 2 : i - 1,
                    next_index = i === 2 ? 0 : i + 1;

                angular.copy(default_slides[1], _self.slides[i]);
                angular.copy(default_slides[0], _self.slides[previous_index]);
                angular.copy(default_slides[2], _self.slides[next_index]);
                direction = 0;
                head = _self.slides[previous_index].nr;
                tail = _self.slides[next_index].nr;
            };

            var direction = 0;

            _self.slideChanged = function (i) {
                var
                    previous_index = i === 0 ? 2 : i - 1,
                    next_index = i === 2 ? 0 : i + 1,
                    new_direction = _self.slides[i].nr > _self.slides[previous_index].nr ? 1 : -1;

                angular.copy(
                    createSlideData(new_direction, direction),
                    _self.slides[new_direction > 0 ? next_index : previous_index]
                );
                direction = new_direction;
                
                //var looping = false;
                //if(_self.slides[i].nr == 0 || _self.slides[i].nr == 4) looping = false;
                //else looping = true;
                //_self.loop(looping);
                
                //console.log('looping',looping);
            };
            
            _self.getIfromNr=function(nr){
                for (var i = 0; i < _self.slides.length; i++) {
                    if (_self.slides[i].nr == nr) {
                        return i;
                    }
                }
                return -1;
            }

            var
                head = _self.slides[0].nr,
                tail = _self.slides[_self.slides.length - 1].nr;

            var createSlideData = function (new_direction, old_direction) {
                var nr;

                if (new_direction === 1) {
                    tail = old_direction < 0 ? head + 3 : tail + 1;
                } else {
                    head = old_direction > 0 ? tail - 3 : head - 1;
                }

                nr = new_direction === 1 ? tail : head;
                if (default_slides_indexes.indexOf(nr) !== -1) {
                    return default_slides[default_slides_indexes.indexOf(nr)];
                };
                return makeSlide(nr, {
                    title: 'generated slide',
                    get color() {
                        return getColor(this.nr)
                    }
                });
            };
            

        }
        
        return _InfiniteSlideBox;
    });
}())