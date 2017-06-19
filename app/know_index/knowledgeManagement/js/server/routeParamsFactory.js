/**
 * Created by 41212 on 2017/6/14.
 */
knowledge_static_web.factory('myService', function() {
    var savedData = {} ;
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }
    return {
        set: set,
        get: get
    }
})
