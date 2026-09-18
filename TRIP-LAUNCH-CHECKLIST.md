# New trip launch checklist

Use one folder per trip. Add its name to `assets/config.js` and make it `ACTIVE` only when it is the current trip. Add its facts to `assets/trip-facts.js`. Leave completed trip pages and data alone.

Before publishing:

1. Pick one target date and one recommended anchor activity. Explain why; label unconfirmed availability clearly.
2. For every venue option, show a useful photo with its author/license link, what visitors actually do there, adult price, visit duration, opening hours for the target date, and the official source. Recheck mutable facts and record the date checked.
3. Compare route distance and time through each stop against the direct route. Show the fuel formula and party size. Label food as an allowance unless a real menu price is sourced. Count entry fees once.
4. Keep optional stops and meals distinct. If a choice depends on another choice, explain the dependency beside the control and reset invalid saved picks. Omit options with no planning value.
5. Use the actual confirmed booking start time for clock schedules. Before confirmation, show durations and booking tasks; never invent a departure time or imply that a slot exists.
6. Put direct call, email and official booking links next to each booking task. Tell the crew what must be confirmed and when the weather decision arrives.
7. Load `config.js` before `store.js` on all trip pages. Show `CREW.renderSuggestions` on sign-up, draft and plan, subscribe with `CREW.onChange`, and provide invite and plan-share controls. Test with two separate browser profiles: save a suggestion in one, then see it in the other after load/focus without using the same local storage.
8. Run `node scripts/check-active-trip.mjs`, test on desktop and phone widths, open each link, and verify the live deployed page after publishing. The automated check covers wiring; a person must still verify source facts, photo rights and real bookings.
