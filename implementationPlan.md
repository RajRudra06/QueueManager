cat > "/Users/rudrarajpurohit/Desktop/ATL Lab Demo/IMPLEMENTATION_README.md" <<'EOF'
I have your full synopsis now, so I will do one quick discovery pass over the workspace and then lock a concrete phase-by-phase build plan for Flutter plus Node and Mongo. After that I will ask only the minimum decisions needed so the plan is implementation-ready with no guesswork.

Workspace discovery

Read [](file:///Users/rudrarajpurohit/Desktop/ATL%20Lab%20Demo)



Searched for files matching `/Users/rudrarajpurohit/Desktop/ATL\ Lab\ Demo/**/{pubspec.yaml,package.json,.flutter,pubspec.lock,node_modules}`, no matches

Fetched [resource](file:///Users/rudrarajpurohit/Desktop/ATL Lab Demo/ATL_LAB_Synopsis.docx)

Read changed files in [](file:///Users/rudrarajpurohit/Desktop/ATL%20Lab%20Demo)

Read memory [](file:///Users/rudrarajpurohit/Library/Application%20Support/Code/User/workspaceStorage/e95447a7fa5a0febc95980a1a48e4813/GitHub.copilot-chat/memory-tool/memories/Mjk4MjcyYWItYjMxMC00ODg5LTljZTMtYjdlZTJkMmZiMDUw)

Read memory [](file:///Users/rudrarajpurohit/Library/Application%20Support/Code/User/workspaceStorage/e95447a7fa5a0febc95980a1a48e4813/GitHub.copilot-chat/memory-tool/memories/Mjk4MjcyYWItYjMxMC00ODg5LTljZTMtYjdlZTJkMmZiMDUw/plan.md)

Discovery confirms there is no usable Flutter or backend scaffold in the current workspace, so planning from scratch is the right move. I will now capture 4 key decisions (database hosting, auth, real-time strategy, and MVP cut) so the plan can be executed directly.

Analyzing your answers...

Great, your choices are clear: Atlas, JWT role auth, Socket.IO from the start, and Extended MVP. I will now write the full execution plan into session memory and then present a clean, scannable version for your approval before any coding.

Read memory [](file:///Users/rudrarajpurohit/Library/Application%20Support/Code/User/workspaceStorage/e95447a7fa5a0febc95980a1a48e4813/GitHub.copilot-chat/memory-tool/memories/Mjk4MjcyYWItYjMxMC00ODg5LTljZTMtYjdlZTJkMmZiMDUw/plan.md)

Deleted memory [](file:///Users/rudrarajpurohit/Library/Application%20Support/Code/User/workspaceStorage/e95447a7fa5a0febc95980a1a48e4813/GitHub.copilot-chat/memory-tool/memories/Mjk4MjcyYWItYjMxMC00ODg5LTljZTMtYjdlZTJkMmZiMDUw/plan.md)

Created memory file [](file:///Users/rudrarajpurohit/Library/Application%20Support/Code/User/workspaceStorage/e95447a7fa5a0febc95980a1a48e4813/GitHub.copilot-chat/memory-tool/memories/Mjk4MjcyYWItYjMxMC00ODg5LTljZTMtYjdlZTJkMmZiMDUw/plan.md)

## Plan: Smart Queue Flutter + Node Delivery

I have now fully mapped your synopsis into an execution-ready plan and saved it in session memory at /memories/session/plan.md.  
This plan is based on your selected decisions:
1. MongoDB Atlas (cloud)
2. Email/password JWT auth with roles
3. Socket.IO from day one
4. Extended MVP scope

Source requirement file: ATL_LAB_Synopsis.docx

**Steps**
1. Phase 0 - Foundation
2. Set repo structure with two apps: mobile (Flutter) and server (Express).
3. Install and verify macOS prerequisites: Flutter SDK, Android Studio SDK/emulator, Xcode/iOS simulator, Node LTS, npm, VS Code extensions.
4. Run health checks: flutter doctor, dart version, node version, npm version.
5. Create initial Flutter and Express scaffolds with environment config.

6. Phase 1 - Backend Core (Blocks frontend integration)
7. Define Mongo models: users, services, slots, appointments, queue state, notification logs.
8. Build auth: register/login, password hashing, JWT issuance, role guards.
9. Build admin APIs: service CRUD, slot/capacity config, queue controls.
10. Build student APIs: browse services/slots, book, cancel, reschedule, history.
11. Enforce concurrency-safe booking and capacity rules.
12. Add Socket.IO queue events and room strategy.
13. Add notification hooks and analytics APIs.

14. Phase 2 - Flutter Core
15. Set app architecture: routing, state management (recommended Riverpod), REST client, websocket client.
16. Build auth and role-based navigation.
17. Build student flows: browse, book, track queue live, manage appointments.
18. Build admin flows: manage services/slots/capacity, queue control, analytics view.
19. Add FCM push notification handling.

20. Phase 3 - Reliability and Security
21. Standardize API contracts and validation.
22. Add centralized error model, logging, health endpoint, and rate limits.
23. Harden auth/session and environment security.

24. Phase 4 - Testing and Demo Readiness
25. Backend tests for auth, booking conflicts, capacity, queue advancement.
26. Flutter tests for critical flows and queue state updates.
27. End-to-end scenario: student books, admin advances, student gets live update + notification.
28. Seed demo data and run UAT checklist.

**Dependencies and Parallel Work**
1. Backend schema and API contracts are blockers for deep Flutter integration.
2. Analytics UI can run in parallel once analytics response shapes are fixed.
3. Notification verification depends on FCM setup and test devices/emulators.

**Verification**
1. Toolchain passes on macOS (no blocking flutter doctor issues).
2. Auth works for both STUDENT and ADMIN and enforces role restrictions.
3. Booking rules prevent overbooking and duplicate conflicts.
4. Queue updates propagate in near real-time via Socket.IO.
5. Notifications trigger for booking confirmation and approaching turn.
6. Extended MVP demo flow runs end-to-end without manual DB edits.

If you approve this plan, next step is Phase 0 only: I will start with installation and environment setup commands for Flutter on your Mac, then verify everything before scaffolding code.
EOF