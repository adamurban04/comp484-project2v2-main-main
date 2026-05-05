$(function() { // Makes sure that function is called once all the DOM elements of the page are ready to be used.
    
    // Update the pet stats
    checkAndUpdatePetInfoInHtml();
  
    // Instead of attaching 4 separate click handlers (one per button), I attach ONE handler to the
    // parent container. This pattern is called *event delegation* and it keeps the code shorter.
    // It also keeps working even if we ever change the buttons later (because the container stays).
    //
    // UNIQUE jQuery method #1: .closest(selector)
    // - What it does:
    //   Starting from a specific element, .closest() walks UP the DOM tree (parents, grandparents, etc.)
    //   until it finds the nearest ancestor that matches the selector.
    //
    // - Why it is useful here:
    //   When you click a button, the actual `event.target` might not be the <button> itself.
    //   Example: if the button contains text or other HTML, the click could land on a child node.
    //   By doing $(event.target).closest('button'), I reliably get the real button that was clicked,
    //   so my .hasClass('treat-button') / .hasClass('play-button') checks always work.
    //   If the click wasn't on a button at all, $button will just be an empty jQuery object and
    //   none of the action branches will run.
    $('.button-container').on('click', function (event) {
      var $button = $(event.target).closest('button');


      if ($button.hasClass('treat-button')) {
        clickedTreatButton();
      } else if ($button.hasClass('play-button')) {
        clickedPlayButton();
      } else if ($button.hasClass('exercise-button')) {
        clickedExerciseButton();
      } else if ($button.hasClass('sleep-button')) {
        clickedSleepButton();
      }
    });

    // Change-name listeners:
    // Read the input box and update pet_info.name
    $('.set-name-button').click(setPetNameFromInput);
    $('.name-input').on('keydown', function (event) {
      if (event.key === 'Enter') {
        setPetNameFromInput();
      }
    });

    // DevTools homework (Part 2): wire up error/network demo buttons
    // Why this exists:
    //
    // How it works:
    // - This is another example of event delegation: I attach ONE click handler to the parent
    //   container (.devtools-buttons), then detect which button was clicked by CSS class.
    $('.devtools-buttons').on('click', function (event) {
      // Use .closest('button') so clicks on the button text still count as clicking the button.
      var $btn = $(event.target).closest('button');
      if (!$btn.length) return;

      if ($btn.hasClass('dt-404-button')) {
        // Triggers a real 404 request so the browser logs an error and Network shows the 404.
        dtCause404();
      } else if ($btn.hasClass('dt-typeerror-button')) {
        // Triggers an uncaught TypeError.
        dtCauseTypeError();
      } else if ($btn.hasClass('dt-violation-button')) {
        // Triggers a long task so Chrome may log a [Violation] message.
        dtCauseViolation();
      } else if ($btn.hasClass('dt-bug-button')) {
        // Triggers an intentional bug.
        dtReproduceBug();
      } else if ($btn.hasClass('dt-console-extras')) {
        // Bonus demo: extra Console API methods that are useful in DevTools.
        dtConsoleExtras();
      } else if ($btn.hasClass('dt-clear-console')) {
        // Clears console
        console.clear();
        showPetMessage('Console cleared.');
      }
    });

    // DevTools homework (Part 3): Filtering Messages
    // Print a set of console messages
    // - Filter by log level (log/info/warn/error)
    // - Filter by text (unique)
    // - Filter by regular expression (patterns)
    dtGenerateFilterLogs();
  })
  
    // Pet stats object (with default values)
    var pet_info = { name: "Amin", weight: 20, happiness: 50, energy: 10 };

    // Change Name function
    function setPetNameFromInput() {
      // This takes whatever the user typed and sets it as the pet name.
      var newName = $('.name-input').val().trim();

      if (!newName) {
        showPetMessage("Type a name first!");
        return;
      }

      // Keep it a reasonable length so it doesn't break the layout
      if (newName.length > 16) {
        newName = newName.slice(0, 16);
      }

      pet_info.name = newName;
      $('.name-input').val('');

      checkAndUpdatePetInfoInHtml();
      showPetMessage("My new name is " + newName + "!");

      // DevTools homework (Part 1): demonstrate Console logging features using existing UI.
      // This block runs when you click "Set Name".

      // Requirement: "Log Group"
      // - create collabsible group folder in the Console containing related logs
      console.groupCollapsed('[Log Group] Set Name');

      // Requirement: "Message Logging" (regular console.log)
      console.log('[Message Logging] Name changed to:', newName);

      // Requirement: "Log Table" (console.table)
      // - create stats log in table view
      console.table([
        { stat: 'name', value: pet_info.name },
        { stat: 'weight', value: pet_info.weight },
        { stat: 'happiness', value: pet_info.happiness },
        { stat: 'energy', value: pet_info.energy }
      ]);

      // Requirement: "Log Custom" (styled log using %c)
      console.log(
        '%cLog%c (custom style)',
        'background:#111111;color:#ffffff;padding:2px 3px;border-radius:3px;font-weight:900;', //applied to "Log Cusom"
        'color:red;font-weight:700;', // applied to "styled"
        { action: 'set-name', pet: pet_info.name }
      );

      console.groupEnd();
    }

    // ACTION BUTTONS EVENT HANDLERS
  
    function clickedTreatButton() {
      // Treat
      pet_info.happiness += 2;
      pet_info.weight += 1;
      pet_info.energy += 1;

      setPetSprite('treat');
      playSfx('sfx-treat');
      showPetMessage("Yum!");
      checkAndUpdatePetInfoInHtml();

      // DevTools requirement: "Message Logging" (console.log)
      // - print normal message + current pet object stats
      console.log('[Message Logging] Treat clicked', {
        name: pet_info.name,
        weight: pet_info.weight,
        happiness: pet_info.happiness,
        energy: pet_info.energy
      });
    }
    
    function clickedPlayButton() {
      // Play
      pet_info.happiness += 4;
      pet_info.weight -= 1;
      pet_info.energy -= 2;

      setPetSprite('play');
      playSfx('sfx-play');
      showPetMessage("Fun!");
      checkAndUpdatePetInfoInHtml();

      // DevTools requirement: "Log Info" (console.info)
      // print "info" level message (with icon)
      console.info('[Log Info] Play clicked', {
        name: pet_info.name,
        weight: pet_info.weight,
        happiness: pet_info.happiness,
        energy: pet_info.energy
      });
    }
    
    function clickedExerciseButton() {
      // Exercise
      pet_info.happiness -= 1;
      pet_info.weight -= 2;
      pet_info.energy -= 3;

      setPetSprite('exercise');
      playSfx('sfx-exercise');
      showPetMessage("Whew... musclesss, yay!");
      checkAndUpdatePetInfoInHtml();

      // DevTools requirement: "Log Warning" (console.warn)
      // - print warning level message
      console.warn('[Log Warning] Exercise clicked', {
        name: pet_info.name,
        weight: pet_info.weight,
        happiness: pet_info.happiness,
        energy: pet_info.energy
      });
    }

    function clickedSleepButton() {
      // Sleep
      pet_info.happiness += 1;
      pet_info.energy += 5;

      setPetSprite('sleep');
      playSfx('sfx-sleep');
      showPetMessage("Zzz...");
      checkAndUpdatePetInfoInHtml();

      // DevTools requirement: "Log Error" (console.error)
      // - print error level message (does not crash the app)
      console.error('[Log Error] Sleep clicked (demo error log)', {
        name: pet_info.name,
        weight: pet_info.weight,
        happiness: pet_info.happiness,
        energy: pet_info.energy
      });
    }

    // --------------------------
    // DevTools homework (Part 2)
    // --------------------------

    function dtCause404() {
      // Requirement: "Cause 404 network error" + "View messages logged by the browser"
      // - DevTools Console: a log warn message "Requested missing resource..."
      // - DevTools Network tab: one request with Status = 404
      //
      // How it works:
      // - We create an Image() element in JavaScript and set its `.src` to a file that does NOT exist.
      // - The browser still attempts the HTTP request, which produces a real 404 response.
      // - Appending it to the DOM ensures the request is made and appears in Network.

      var missingUrl = 'assets/not-real-url.png';

      var img = new Image();
      img.alt = 'missing image (devtools demo)';
      img.style.display = 'none';
      img.src = missingUrl;
      document.body.appendChild(img);

      console.warn('[Cause 404] Requested missing resource:', missingUrl);
      showPetMessage('Triggered a 404.');
    }

    function dtCauseTypeError() {
      // Requirement: "Cause TypeError" (uncaught)
      //
      // How it works:
      // - `nothingHere` is null, so trying to read `nothingHere.value` crashes.

      console.warn('[Cause TypeError] Triggering an uncaught TypeError...');
      showPetMessage('Triggering TypeError...');

      var nothingHere = null;
      // This line intentionally throws an error:
      console.log(nothingHere.value);
    }

    function dtCauseViolation() {
      // Requirement: "Cause Violation"
      // - DevTools Console: a [Violation] warning (Chrome prints these when a task runs too long)
      //
      // How it works:
      // - We run a busy loop for 300ms.
      // - This blocks the main thread and UI can't update.
      // - Chrome should report that as a [Violation] message.

      console.warn('[Cause Violation] Starting a long task...');
      showPetMessage('Starting long task...');

      var start = performance.now();
      while (performance.now() - start < 300) {
        // Intentional long task (busy wait)
      }

      console.log('[Cause Violation] Long task finished (~' + Math.round(performance.now() - start) + 'ms)');
      // under this log, there should be a violation message
    }

    // --------------------------
    // DevTools homework (Part 3)
    // --------------------------

    function dtGenerateFilterLogs() {
      // Requirement: "Filter Messages"
      //
      // Why this exists:
      // We print predictable logs that are easy to filter by:
      // - Filter by log level
      // - Filter by text
      // - Filter by regular expression
      // - Filter by user messages
      //
      // Note on "Filter by message source":
      // These logs are *user messages* (from console.*).
      // For a browser/network source message, use the Part 2 "Cause 404" button.

      // Guard so Live Server refreshes don't spam the Console.
      if (window.__dtFilterLogsPrinted) return;
      window.__dtFilterLogsPrinted = true;

      console.log('[Filter by text] FILTER_ME apple banana');
      console.log('[Filter by regex] petId=PET-1234 energy=' + pet_info.energy + ' happiness=' + pet_info.happiness);

      // Filter by level examples:
      console.info('[Filter by log level] info: name=' + pet_info.name);
      console.warn('[Filter by log level] warning: weight=' + pet_info.weight);
      console.error('[Filter by log level] error: demo-only');

      // Filter by text example with a clear keyword:
      console.log('KEYWORD_DEMO: try filtering for KEYWORD_DEMO');

      // Another regex-friendly pattern:
      console.log('orderId=ORD-0042 status=OK');
    }

    // --------------------------
    // DevTools homework (Part 4)
    // --------------------------

    function dtReproduceBug() {
      // Requirement: "Reproduce a bug" + Sources debugging practice
      //
      // - Console prints the WRONG result first (bug is intentional)
      // - After the bug is fixed in Sources, it prints the correct result
      //
      // How to use in DevTools :
      // 1) DevTools -> Sources -> open script.js
      // 2) Set a breakpoint inside buggyAverage() (line-of-code breakpoint)
      // 3) Click "Reproduce Bug" again to pause on the breakpoint
      // 4) Inspect variables in the Scope pane (nums, i, sum)
      // 5) Add Watch expressions (sum, i, nums[i])
      // 6) Use the Console while paused (ex: type `sum` or `nums[i]`)
      // 7) Apply the fix: change `i <= nums.length` to `i < nums.length`

      var nums = [1, 2, 3, 4];
      var result = buggyAverage(nums);

      console.log('[Reproduce a bug] buggyAverage([1,2,3,4]) expected 2.5, got:', result);
      showPetMessage('Bug reproduced. Use Sources breakpoints + Watch + Scope, then apply a fix.');
    }

    function dtConsoleExtras() {
      // BONUS: console.count
      // Docs: https://developer.chrome.com/docs/devtools/console/api/
      //
      // console.count(label): increments a counter each time this runs.
      console.count('[Bonus] Console Extras clicked');

      showPetMessage('Bonus logs: count');
    }

    function buggyAverage(nums) {
      // Intentional bug:
      // This loop uses i <= nums.length, which runs one extra iteration.
      // On the last iteration, nums[i] is undefined, so sum becomes NaN.
      // Fix: change `i <= nums.length` to `i < nums.length`.

      var sum = 0;
      for (var i = 0; i <= nums.length; i++) {
        sum += nums[i];
      }
      return sum / nums.length;
    }

    // Sprite moods (paths)
    var pet_sprites = {
      neutral: "images/neutral.jpg",
      treat: "images/treat.jpg",
      play: "images/play.jpg",
      exercise: "images/exercise.jpg",
      sleep: "images/sleep.jpg",
      tired: "images/tired.jpg"
    };

    // flag so I know if the sprite was forced to "tired" because a stat went critical.
    var spriteForcedTired = false;

    // Set sprite to correct mood
    function setPetSprite(moodKey) {
      // Swap the sprite image based on what the pet is doing
      var spritePath = pet_sprites[moodKey] || pet_sprites.neutral;
      $('#pet-sprite').attr('src', spritePath);

      // UNIQUE jQuery method #2: .animate(properties, duration)
      // - What it does:
      //   .animate() smoothly changes numeric CSS properties over time.
      //   It takes an object of CSS properties to animate (ex: { top: -10 }) plus a duration in ms.
      //
      // - Why it is useful here:
      //   This little "bounce" makes the pet feel responsive whenever you click an action
      //
      // .stop(true, true) is there so repeated clicks don't stack a huge queue of bounces
      $('#pet-sprite')
        .stop(true, true)
        .animate({ top: -10 }, 90)
        .animate({ top: 0 }, 140);
    }

    function playSfx(audioId) {
      // Sound effect helper
      var audio = document.getElementById(audioId);
      if (!audio) return;
      var hasFile = !!audio.getAttribute('src') || !!audio.currentSrc || !!audio.querySelector('source');
      if (!hasFile) return;

      try {
        audio.muted = false;
        audio.volume = 1;

        // Restart the sound from the beginning each click
        audio.pause();
        audio.currentTime = 0;

        var playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () { // catch errors
          });
        }
      } catch (e) {
      }
    }

    function showPetMessage(message) {
      // This updates the fixed text box at the bottom of the screen.
      // This is a visual notification (not alert() and not console.log()).

      var $messageBox = $('.pet-message');
      $messageBox.text(message);

      // .animate() jQuery method again: 
      //  I start the message slightly faded (opacity 0.25), then animate it back to 1.
      $messageBox
        .css({ opacity: 0.25 })
        .animate({ opacity: 1 }, 220);
    }

    function checkAndUpdatePetInfoInHtml() {
      checkWeightAndHappinessAndEnergyBeforeUpdating();  
      updatePetInfoInHtml();
    }
    
    function checkWeightAndHappinessAndEnergyBeforeUpdating() {
      // Quick bug fix: we never want negative numbers for these stats.
      // If a value dips below 0, set it back to 0.
      if (pet_info.weight < 0) {
        pet_info.weight = 0;
      }

      if (pet_info.happiness < 0) {
        pet_info.happiness = 0;
      }

      if (pet_info.energy < 0) {
        pet_info.energy = 0;
      }
    }
    
    // Updates HTML with current values in pet_info object
    function updatePetInfoInHtml() {
      $('.name').text(pet_info['name']);
      $('.weight').text(pet_info['weight']);
      $('.happiness').text(pet_info['happiness']);
      $('.energy').text(pet_info['energy']);

      updateCriticalStatColors();
    }

    function updateCriticalStatColors() {
      // If stats get too low or too high, highlight them in red.

      var weightCritical = (pet_info.weight <= 5) || (pet_info.weight >= 50);
      var happinessCritical = (pet_info.happiness <= 25);
      var energyCritical = (pet_info.energy <= 2);

      setCritical('.weight', weightCritical);
      setCritical('.happiness', happinessCritical);
      setCritical('.energy', energyCritical);

      // If any stat is critical, show the tired sprite
      // This makes it obvious that the pet needs attention
      var anyCritical = weightCritical || happinessCritical || energyCritical;

      if (anyCritical) {
        setPetSprite('tired');
        spriteForcedTired = true;
      } else if (spriteForcedTired) {
        // If we previously forced tired, switch back once everything is safe
        setPetSprite('neutral');
        spriteForcedTired = false;
      }
    }

    function setCritical(selector, isCritical) {
      var el = document.querySelector(selector);
      if (!el) return;

      if (isCritical) {
        el.classList.add('critical');
      } else {
        el.classList.remove('critical');
      }
    }
  
