var add_usage_data, api_key, fetch_sm, fetch_usage_list, fill_album_list, fill_image_list;

api_key = "fCXo05bxAfCoY31I5vtcmPr8AEY3uQTr";

fetch_sm = function(url, callback) {
  return $.ajax({
    url: `https://www.smugmug.com/api/v2/${url}?APIKey=${api_key}&count=5000`,
    method: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: callback,
    error: function(err) {
      return alert(`Error: ${err}`);
    }
  });
};

fill_album_list = function(albums) {
  var ret;
  ret = "";
  $(albums).each(function(i, album) {
    return ret += `<tr class=\"album-row\" data-key=\"${album["AlbumKey"]}\"><td><a href=\"${album['WebUri']}\" class=\"usage-link\">${album["Name"]}</a></td><td>${album["AlbumKey"]}</td><td>${album["ImageCount"]}</td><td class=\"usage\">?</td></tr>\n`;
  });
  return $("#smug-albums tbody").html(ret);
};

fill_image_list = function(images) {
  var ret;
  ret = "";
  $(images).each(function(i, image) {
    return ret += `<tr class=\"image-row\" data-key=\"${image["ImageKey"]}\"><td><a href=\"${image['WebUri']}\"><img src=\"${image["ThumbnailUrl"]}\" alt=\"Thumb\"/></a><td>${image["Title"]}</td><td>${image["FileName"]}</td><td>${image["ImageKey"]}</td><td class=\"usage\">?</td></tr>\n`;
  });
  return $("#smug-images tbody").html(ret);
};

fetch_usage_list = function(url, callback) {
  return $.ajax({
    url: url,
    method: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: callback,
    error: function(err) {
      return alert(`Error: ${err}`);
    }
  });
};

add_usage_data = function(albums) {
  return $.each(albums, function(albumKey, show) {
    return $(`[data-key=${albumKey}] .usage`).html(`<a href=\"${show['link']}\" title=\"${show['title']}\" class=\"usage-link\">Y</a>`).addClass("yes");
  });
};

document.addEventListener('DOMContentLoaded', function() {
  var key;
  if ($('body').hasClass('util-smug-albums')) {
    fetch_sm("user/newtheatre!albums", function(data) {
      window.d = data;
      fill_album_list(data["Response"]["Album"]);
      return fetch_usage_list("/feeds/smug_albums.json", function(data) {
        add_usage_data(data);
        return $("#smug-albums").tablesorter();
      });
    });
  }
  if ($('body').hasClass('util-smug-album')) {
    key = $('#smug-images').data("album");
    return fetch_sm(`album/${key}!images`, function(data) {
      window.d = data;
      fill_image_list(data["Response"]["AlbumImage"]);
      // Show assets
      if (key === "C87GJX" || key === "j3PdMh") {
        fetch_usage_list("/feeds/smug_images.json", function(data) {
          add_usage_data(data);
          return $("#smug-images").tablesorter();
        });
      }
      // Headshots
      if (key === "hZh8Jt") {
        fetch_usage_list("/feeds/smug_headshots.json", function(data) {
          add_usage_data(data);
          return $("#smug-images").tablesorter();
        });
      }
      // Venues
      if (key === "BdFr84") {
        return fetch_usage_list("/feeds/smug_venues.json", function(data) {
          add_usage_data(data);
          return $("#smug-images").tablesorter();
        });
      }
    });
  }
});

//# sourceMappingURL=utility.js.map
