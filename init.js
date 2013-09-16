/* ------------------------------------------------------------------------- */
/* Conkeror config file */
/* ------------------------------------------------------------------------- */

// teach me something whenever I start my browser
homepage = "http://en.wikipedia.org/wiki/Special:Random";

//allow for 'contrib' stuff
load_paths.unshift("chrome://conkeror-contrib/content/");
require("/Users/daha1836/.conkerorrc/webjumps.js");
require("/Users/daha1836/.conkerorrc/readability.js");
require("/Users/daha1836/.conkerorrc/commands.js");
require("/Users/daha1836/.conkerorrc/firebug-lite.js");
require("/Users/daha1836/.conkerorrc/shortcuts.js");
require("/Users/daha1836/.conkerorrc/switch-recent-buffer.js");
require("/Users/daha1836/.conkerorrc/tinurl.js");


// Mode-line
mode_line_mode(true);

// auto completion in the minibuffer
minibuffer_auto_complete_default = true;
url_completion_use_bookmarks = true;
url_completion_use_history = true; // should work since bf05c87405

// display the url before going to it in hints mode
hints_display_url_panel = true;

// add favicons
require("favicon.js");
add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
read_buffer_show_icons = true;

// but really we'd also like to know how many buffers
// are present and which is the current
add_hook("mode_line_hook", mode_line_adder(buffer_count_widget), true);

// we don't need a clock
remove_hook("mode_line_hook", mode_line_adder(clock_widget));

// Open Middle-Clicked Links in New Buffers
require("clicks-in-new-buffer.js");
clicks_in_new_buffer_target = OPEN_NEW_BUFFER_BACKGROUND;
clicks_in_new_buffer_button = 2;

// follow link in new buffer
define_key(content_buffer_normal_keymap, "d", "follow-new-buffer");
define_key(content_buffer_normal_keymap, "t", "find-url-new-buffer");

// Mozrepl
user_pref('extensions.mozrepl.autoStart', true);


let (mozrepl_init = get_home_directory()) {
        mozrepl_init.appendRelativePath(".mozrepl.js");
        session_pref('extensions.mozrepl.initUrl', make_uri(mozrepl_init).spec);
};

// let xkcd-mode put the funny alt text into the page.
xkcd_add_title = true;

// Switch to Buffers 1-10 Using Number Keys 1 through 0
function define_key_buffer_switch(key, buf_num) {
//    define_key(content_buffer_normal_keymap, key, function (I) {
    define_key(default_global_keymap, key, function (I) {
        switch_to_buffer(I.window, I.window.buffers.get_buffer(buf_num));
    });
    define_key(download_buffer_keymap, key, function (I) {
        switch_to_buffer(I.window, I.window.buffers.get_buffer(buf_num));
    });
}
for (let i = 0; i < 10; ++i) {
    define_key_buffer_switch(i == 9 ? "0" : (i+1).toString(), i);
}

// modifiers.M = new modifier(function (event) { return event.altKey; },
//                            function (event) { event.altKey = true; });
// modifiers.A = new modifier(function (event) { return event.metaKey; },
//                            function (event) { event.metaKey = true; });

// commented thist 12/07/2012
// modifiers.A = new modifier(function (event) { return event.altKey; },
//                            function (event) { event.altKey = true; });


editor_shell_command = "/usr/local/bin/emacsclient";
// view source in your editor.
view_source_use_external_editor = true;

// redefine C-f as "forwards" and C-b as "backwards"
// using F and B (that is Shift+F, Shift+B is actually rather inconvenient since
// many other command use Control and so requires shifting fingers)
define_key(content_buffer_normal_keymap, "C-f", "forward");
define_key(content_buffer_normal_keymap, "C-b", "back");

// make M-f and M-b switch to next and previous buffers
define_key(content_buffer_normal_keymap, "M-f", "buffer-next");
define_key(content_buffer_normal_keymap, "M-b", "buffer-previous");

// redefine l as "follow link" (like f)
// (too many of the keys are for the left hand, I like "l" for "link")
define_key(content_buffer_normal_keymap, "l", "follow");

// Use M-l to follow link in new background buffer
define_key(default_global_keymap, "M-l", "follow-new-buffer-background");

// open url in new background buffer  (I can't think of a good keybinding for this)
interactive("find-url-new-background-buffer",
    "Open a URL in a new background buffer",
    alternates(follow_new_buffer_background, follow_new_window),
    $browser_object = browser_object_url,
    $prompt = "Find url");

// make C-c C-c "submit form"
define_key(content_buffer_normal_keymap, "C-c C-c", "submit-form");

// make C-x 0 "kill current buffer"
define_key(default_global_keymap, "C-x 0", "kill-current-buffer");

// make C-x 1 "kill other buffers"
define_key(content_buffer_normal_keymap, "C-x 1", "kill-other-buffers");

// make C-x 2 "duplicate buffer"
interactive("duplicate-buffer", "Duplicate buffer",
            function (I) {
              browser_object_follow(I.buffer, OPEN_NEW_BUFFER, I.buffer.current_uri.spec);
            });
define_key(content_buffer_normal_keymap, "C-x 2", "duplicate-buffer");

// cwd
cwd=get_home_directory();
cwd.append("Downloads");


// No new window for downloads
download_buffer_automatic_open_target=OPEN_NEW_BUFFER_BACKGROUND;

// Make sure I don't close by accident
 add_hook("before_quit_hook",
           function () {
               var w = get_recent_conkeror_window();
               var result = (w == null) ||
                   "y" == (yield w.minibuffer.read_single_character_option(
                       $prompt = "Quit Conkeror? (y/n)",
                       $options = ["y", "n"]));
               yield co_return(result);
           });

can_kill_last_buffer = false;

// copy url with C-c u
interactive("copy-url",
        "Copy the current buffer's URL to the clipboard",
        function(I) {
            var text = I.window.buffers.current.document.location.href;
            writeToClipboard(text);
            I.window.minibuffer.message("copied: " + text);
        }
);
define_key(default_global_keymap, "C-c u", "copy-url");

// reload conkerorrc with C-c r
interactive("reload-config", "reload conkerorrc",
       function(I) {
          load_rc();
          I.window.minibuffer.message("config reloaded");
       }
);
define_key(default_global_keymap, "C-c r", "reload-config");

require('eye-guide.js');
define_key(content_buffer_normal_keymap, "space", "eye-guide-scroll-down");
define_key(content_buffer_normal_keymap, "back_space", "eye-guide-scroll-up");

function darken_page (I) {
    var styles='* { background: black !important; color: grey !important; }'+
        ':link, :link * { color: #4986dd !important; }'+
        ':visited, :visited * { color: #d75047 !important; }';
    var document = I.buffer.document;
    var newSS=document.createElement('link');
    newSS.rel='stylesheet';
    newSS.href='data:text/css,'+escape(styles);
    document.getElementsByTagName("head")[0].appendChild(newSS);
}

interactive("darken-page", "Darken the page in an attempt to save your eyes.",
            darken_page);



// This is a common enough requirement for me that I bind it to C-d:

define_key(content_buffer_normal_keymap, "C-d", "darken-page");

// for org-protocol

function org_store_link (url, title, window) {
    var cmd_str = '/usr/local/bin/emacsclient \"org-protocol://store-link://'+url+'/'+title+'\"';
    if (window != null) {
      window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);
}

interactive("org-store-link", "Stores [[url][title]] as org link and copies url to emacs kill ring",
          function (I) {
              org_store_link(encodeURIComponent(I.buffer.display_uri_string), encodeURIComponent(I.buffer.document.title), I.window);
          });

function org_capture (url, title, selection, window) {
    var cmd_str = '/usr/local/bin/emacsclient \"org-protocol://capture://'+url+'/'+title+'/'+selection+'\"';
    if (window != null) {
      window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);
}

interactive("org-capture", "Clip url, title, and selection to capture via org-protocol",
          function (I) {
              org_capture(encodeURIComponent(I.buffer.display_uri_string), encodeURIComponent(I.buffer.document.title), encodeURIComponent(I.buffer.top_frame.getSelection()), I.window);
          });
define_key(content_buffer_normal_keymap, "C-c r", "org-capture");
define_key(content_buffer_normal_keymap, "C-c l", "org-store-link");





// Enable the password manager
Components.classes["@mozilla.org/login-manager;1"].getService(
           Components.interfaces.nsILoginManager);



url_remoting_fn = load_url_in_new_buffer;



// delicious

interactive("delicious-post",
            "bookmark the page via delicious",
            function (I) {
              check_buffer(I.buffer, content_buffer);
              let posturl = 'https://vinylisland.org/apps/insipid/?op=add_bookmark&url=' +
                encodeURIComponent(
                  load_spec_uri_string(
                    load_spec(I.buffer.top_frame))) +
               '&title=' +
                encodeURIComponent(
                  load_spec_uri_string(
                    load_spec(I.buffer.title))) +
                '&redirect=true' +
                '&description=' +
                encodeURIComponent(
                  yield I.minibuffer.read(
                    $prompt = "extended description: "));
              try {
                load_url_in_new_buffer(load_spec({uri:posturl}));
              }
              catch (e)
              {
                //              I.window.minibuffer.message(posturl);
              }
            }
           );

interactive("delicious-post-link",
            "bookmark the link via delicious",
            function (I) {
              bo = yield read_browser_object(I) ;
              mylink = load_spec_uri_string(
                load_spec(encodeURIComponent(bo)));
              check_buffer(I.buffer, content_buffer);
              let postlinkurl = 'https://vinylisland.org/apps/insipid/?op=add_bookmark&url=' +
                mylink +
                '&title=' +
                encodeURIComponent(
                  yield I.minibuffer.read(
                    $prompt = "title (required): ")) +
                '&redirect=true' +
                // '&tags=' +
                // encodeURIComponent(
                //   yield I.minibuffer.read(
                //     $prompt = "tags (space delimited): ")) +
                '&description=' +
                encodeURIComponent(
                  yield I.minibuffer.read(
                    $prompt = "extended description: "));

              try {
                  //          I.window.minibuffer.message(postlinkurl);
                                  load_url_in_new_buffer(load_spec({uri:postlinkurl}));
              }
              catch (e) { }
            }
            , $browser_object = browser_object_links);

define_key(default_global_keymap, "p", "delicious-post");
define_key(default_global_keymap, "P", "delicious-post-link");



define_browser_object_class(
    "history-url", null,
    function (I, prompt) {
        check_buffer (I.buffer, content_buffer);
        var result = yield I.buffer.window.minibuffer.read_url(
            $prompt = prompt,  $use_webjumps = false, $use_history = true, $use_bookmarks = false);
        yield co_return (result);
    });

interactive("find-url-from-history",
            "Find a page from history in the current buffer",
            "find-url",
            $browser_object = browser_object_history_url);

interactive("find-url-from-history-new-buffer",
            "Find a page from history in the current buffer",
            "find-url-new-buffer",
            $browser_object = browser_object_history_url);

define_key(content_buffer_normal_keymap, "h", "find-url-from-history-new-buffer");
define_key(content_buffer_normal_keymap, "H", "find-url-from-history");

// If desired, add the following command to your rc file to open a preferences dialog box for HTTPS Everywhere:

if ('@eff.org/https-everywhere;1' in Cc) {
    interactive("https-everywhere-options-dialog",
                "Open the HTTPS Everywhere options dialog.",
                function (I) {
                    window_watcher.openWindow(
                        null, "chrome://https-everywhere/content/preferences.xul",
                        "", "chrome,titlebar,toolbar,centerscreen,resizable", null);
                });
}




// 6.1. Block Flash, with Host Whitelist

// In fact this blocks all plugin content, not just flash applets, but who's counting?

require("content-policy.js");

function block_flash (content_type, content_location) {
    var Y = content_policy_accept, N = content_policy_reject;
    var action = ({ "homestarrunner.com":Y }
                  [content_location.host] || N);
    if (action == N)
        dumpln("blocked flash: "+content_location.spec);
    return action;
}
content_policy_bytype_table.object = block_flash;
add_hook("content_policy_hook", content_policy_bytype);

interactive("render_instapaper",
            "Render page with InstaPaper's Text view.",
            function (I) {
                var d = I.window.buffers.current.document;
                if(!d.body)
                    throw('Please wait until the page has loaded.');
                browser_object_follow(
                    I.window.buffers.current,
                    OPEN_CURRENT_BUFFER,
                    'http://www.instapaper.com/text?u='+encodeURIComponent(d.location.href));
                I.window.minibuffer.message("Rendering with InstaPaper ...");
            });

// Bind it to 'a':

define_key(content_buffer_normal_keymap, "a", "render_instapaper");

// From dotfiles technomancy


interactive("fill-domain", "Fill the minibuffer with the current domain.",
            function (I) {
                var field = I.minibuffer.input_element;
                var paths = String(I.window.content.location).split('/');
                var domain = paths[0] + "/" + paths[1] + "/" + paths[2] + "/";
                field.value = domain;
            });

define_key(minibuffer_keymap, "C-/", "fill-domain");


// google
require("page-modes/google-search-results.js");
// google_search_bind_number_shortcuts();
define_key(content_buffer_normal_keymap, "C-back_space", "follow", $browser_object = browser_object_relationship_next);
define_key(content_buffer_normal_keymap, "C-tab", "follow", $browser_object = browser_object_relationship_previous);


google_blacklist_array = ["wikipedia", "bigresource.com"];
google_blacklist = "";
for(var i=0; i<google_blacklist_array.length; i++)
{
    google_blacklist += "+-" + google_blacklist_array[i];
}
define_webjump("gf", "http://www.google.com/search?q=%s"+google_blacklist);

// webjumps
define_webjump("gmail", "https://mail.google.com"); // gmail inbox
define_webjump("twitter", "http://twitter.com/#!/search/%s", $alternative = "https://twitter.com/"); // twitter
define_webjump("w3schools", "http://www.w3schools.com"); // w3schools site
define_webjump("w3search", "http://www.google.com/search?sitesearch=www.w3schools.com&as_q=%s"); // w3schools search
define_webjump("jquery", "http://docs.jquery.com/Special:Search?ns0=1&search=%s"); // jquery
define_webjump("archwiki", "https://wiki.archlinux.org/index.php?search=%s"); // arch wiki
define_webjump("stackoverflow", "http://stackoverflow.com/search?q=%s", $alternative = "http://stackoverflow.com/"); // stackoverflow
define_webjump("sor", "http://stackoverflow.com/search?q=[r]+%s", $alternative = "http://stackoverflow.com/questions/tagged/r"); // stackoverflow R section
define_webjump("stats", "http://stats.stackexchange.com/search?q=%s"); // stats
define_webjump("torrentz", "http://torrentz.eu/search?q=%s"); // torrentz
define_webjump("avaxsearch", "http://avaxsearch.com/avaxhome_search?q=%s&a=&c=&l=&sort_by=&commit=Search"); // avaxsearch
define_webjump("imdb", "http://www.imdb.com/find?s=all;q=%s"); // imdb
define_webjump("duckgo", "http://duckduckgo.com/?q=%s", $alternative = "http://duckduckgo.com"); // duckduckgo
define_webjump("blekko", "http://blekko.com/ws/%s", $alternative = "http://blekko.com/"); // blekko
define_webjump("youtube", "http://www.youtube.com/results?search_query=%s&aq=f", $alternative = "http://www.youtube.com"); // youtube
define_webjump("duckgossl", "https://duckduckgo.com/?q=%s"); // duckduckgo SSL
define_webjump("downforeveryoneorjustme", "http://www.downforeveryoneorjustme.com/%s") // downforeveryoneorjustme
define_webjump("rts", "http://rts.rs"); // RTS
define_webjump("facebook", "http://www.facebook.com"); // facebook homepage

// history webjump
define_browser_object_class(
    "history-url", null,
    function (I, prompt) {
        check_buffer (I.buffer, content_buffer);
        var result = yield I.buffer.window.minibuffer.read_url(
            $prompt = prompt, $use_webjumps = false, $use_history = true, $use_bookmarks = false);
        yield co_return (result);
    });

interactive("find-url-from-history",
            "Find a page from history in the current buffer",
            "find-url",
            $browser_object = browser_object_history_url);

interactive("find-url-from-history-new-buffer",
            "Find a page from history in the current buffer",
            "find-url-new-buffer",
            $browser_object = browser_object_history_url);

define_key(content_buffer_normal_keymap, "h", "find-url-from-history-new-buffer");
define_key(content_buffer_normal_keymap, "H", "find-url-from-history");

// load session module
require("session.js");
session_auto_save_auto_load = true; // auto-load session

// don't open download buffer automatically
remove_hook("download_added_hook", open_download_buffer_automatically);

require("cookie.js"); // hopefully this would go in modules/cookie.js so this would not be needed

function for_each_host_cookie(host, fn) {
    var cookies = cookie_manager.getCookiesFromHost(host);
    while (cookies.hasMoreElements()) {
        var cookie = cookies.getNext().QueryInterface(Components.interfaces.nsICookie2);
        fn(cookie);
    }
}

function clear_host_cookies(host) {
    for_each_host_cookie(host,
                         function (cookie) {
                             cookie_manager.remove(cookie.host, cookie.name,
                                                   cookie.path, false);
                         });
}

interactive("clear-site-cookies", "Delete all cookies for the current site",
            function (I) {
                var host = I.buffer.current_uri.host;
                clear_host_cookies(host);
                I.minibuffer.message("Cookies cleared for " + host);
            });
session_pref("signon.rememberSignons", true);
session_pref("signon.expireMasterPassword", false);
session_pref("signon.SignonFileName", "signons.txt");
Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager); // init


define_key(content_buffer_text_keymap, "M-w", "cmd_copy");



define_keywords("$default", "$alternative", "$opml_file");
function define_drupal_summary_webjump(key, base_url) {
    keywords(arguments);
    let alternative = arguments.$alternative;
    let gitweb_url = base_url + "/gitweb.cgi";
    let summary_url = gitweb_url + "?p=%s.git;a=summary";
    let opml_url = gitweb_url + "?a=opml";

    if (arguments.$default)
        alternative = summary_url.replace("%s", arguments.$default);
    if (!alternative)
        alternative = gitweb_url;

    var jmp = new index_webjump_gitweb(key, opml_url, arguments.$opml_file);
    index_webjumps[key] = jmp;

    define_webjump(key, summary_url,
                   $completer = jmp.make_completer(),
                   $alternative = alternative);
}


function define_drupal_webjump(path) {

    find-url(path)

}


// var user_agents = { "conkeror": "Mozilla/5.0 (X11; Linux x86_64; rv:8.0.1) " +
//                     "Gecko/20100101 conkeror/1.0pre",
//                   "chromium": "Mozilla/5.0 (X11; U; Linux x86_64; en-US) " +
//                     "AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63" +
//                     " Safari/534.3",
//                   "firefox": "Mozilla/5.0 (X11; Linux x86_64; rv:8.0.1) " +
//                   "Gecko/20100101 Firefox/8.0.1",
//                   "android": "Mozilla/5.0 (Linux; U; Android 2.2; en-us; " +
//                   "Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like " +
//                   "Gecko) Version/4.0 Mobile Safari/533.1"};

// var agent_completer = prefix_completer($completions = Object.keys(user_agents));

// interactive("user-agent", "Pick a user agent from the list of presets",
//             function(I) {
//                 var ua = (yield I.window.minibuffer.read(
//                     $prompt = "Agent:",
//                     $completer = agent_completer));
//                 set_user_agent(user_agents[ua]);
//             });


// require("github");


// last updated September 22, 2009
define_browser_object_class(
    "tinyurl", "Get a tinyurl for the current page",
    function (I, prompt) {
        check_buffer(I.buffer, content_buffer);
        let createurl = 'http://tinyurl.com/api-create.php?url=' +
            encodeURIComponent(
                load_spec_uri_string(
                    load_spec(I.buffer.top_frame)));
        try {
            var content = yield send_http_request(
                load_spec({uri: createurl}));
            yield co_return(content.responseText);
        } catch (e) { }
    });

define_key(content_buffer_normal_keymap, "* q", "browser-object-tinyurl");


// adblockplus is good
require("extensions/adblockplus.js");

// Tab bar
// require("new-tabs.js");
