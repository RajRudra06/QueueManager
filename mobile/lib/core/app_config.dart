import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class AppConfig {
  static String get apiBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:4000/api';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:4000/api';
    }
    return 'http://localhost:4000/api';
  }
}
