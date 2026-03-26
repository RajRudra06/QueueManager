import 'package:flutter/material.dart';

import '../core/api_client.dart';

class SessionController extends ChangeNotifier {
  SessionController(this.api);

  final ApiClient api;

  String? token;
  Map<String, dynamic>? user;

  bool get isLoggedIn => token != null && user != null;
  bool get isAdmin => user?['role'] == 'ADMIN';

  Future<void> login(String email, String password) async {
    final res = await api.post('/auth/login', {
      'email': email,
      'password': password,
    });

    token = res['token']?.toString();
    user = Map<String, dynamic>.from(res['user'] as Map);
    api.token = token;
    notifyListeners();
  }

  Future<void> register(String name, String email, String password,
      {bool admin = false}) async {
    final res = await api.post('/auth/register', {
      'name': name,
      'email': email,
      'password': password,
      'role': admin ? 'ADMIN' : 'STUDENT',
    });

    token = res['token']?.toString();
    user = Map<String, dynamic>.from(res['user'] as Map);
    api.token = token;
    notifyListeners();
  }

  void logout() {
    token = null;
    user = null;
    api.token = null;
    notifyListeners();
  }
}
