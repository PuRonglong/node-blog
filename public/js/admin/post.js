$(document).ready(function() {

    //page list
    var ndCategory = $('#js-category');
    var ndAuthor = $('#js-author');
    var ndKeyword = $('#js-keyword');

    $('#js-filter-submit').on('click', function(){
        var query = queryString.parse(location.search);

        //获取这两个下拉列表的值
        var category = ndCategory.val();
        var author = ndAuthor.val();
        var keyword = ndKeyword.val();

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

        if(keyword){
            query.keyword = keyword;
        }else{
            delete  query.keyword;
        }

        console.log(queryString.stringify(query));
        window.location.url = window.location.origin + window.location.pathname + queryString.stringify(query);
    })

    //add page
    if(typeof CKEDITOR !== 'undefined'){
        CKEDITOR.replace('js-post-content');
    }
});
