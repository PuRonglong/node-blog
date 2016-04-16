$(document).ready(function() {
    var ngCategory = $('#js-category');
    var ngAuthor = $('#js-author');

    $('#js-filter-submit').on('click', function(){
        var query = queryString.parse(location.search);

        //获取这两个下拉列表的值
        var category = ngCategory.val();
        var author = ngAuthor.val();

        //把用户选到的值放到查询对象里面
        if(category){
            query.category = category;
        }else{
            delete query.category;//如果这个值为空的话,就删掉
        }

        if(author){
            query.author = author;
        }else{
            delete  query.author;
        }

        console.log(queryString.stringify(query));
        window.location.url = window.location.origin + window.location.pathname + queryString.stringify(query);
    })
});
