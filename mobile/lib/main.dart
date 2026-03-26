import 'package:flutter/material.dart';

import 'core/api_client.dart';
import 'core/app_config.dart';
import 'features/admin/admin_home_page.dart';
import 'features/auth/auth_page.dart';
import 'features/home/student_home_page.dart';
import 'state/session_controller.dart';

void main() {
  runApp(const SmartQueueApp());
}

class SmartQueueApp extends StatefulWidget {
  const SmartQueueApp({super.key});

  @override
  State<SmartQueueApp> createState() => _SmartQueueAppState();
}

class _SmartQueueAppState extends State<SmartQueueApp> {
  late final SessionController _session;

  @override
  void initState() {
    super.initState();
    final api = ApiClient(baseUrl: AppConfig.apiBaseUrl);
    _session = SessionController(api);
    _session.addListener(_onSessionChanged);
  }

  @override
  void dispose() {
    _session.removeListener(_onSessionChanged);
    _session.dispose();
    super.dispose();
  }

  void _onSessionChanged() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Queue Manager',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0D9488),
          primary: const Color(0xFF0D9488),
          secondary: const Color(0xFF0F172A),
          surface: const Color(0xFFF8FAFC),
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          backgroundColor: Colors.transparent,
          elevation: 0,
          scrolledUnderElevation: 0,
          titleTextStyle: TextStyle(
            color: Color(0xFF0F172A),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
          iconTheme: IconThemeData(color: Color(0xFF0F172A)),
        ),
        cardTheme: CardThemeData(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          color: Colors.white,
          margin: const EdgeInsets.symmetric(vertical: 8),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF0D9488),
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 0,
            textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF0D9488), width: 2),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        ),
      ),
      home: _session.isLoggedIn
          ? (_session.isAdmin
              ? AdminHomePage(session: _session)
              : StudentHomePage(session: _session))
          : AuthPage(session: _session),
    );
  }
}
