import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiClient {
  ApiClient({required this.baseUrl});

  final String baseUrl;
  String? token;

  Map<String, String> _headers({bool auth = false}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };

    if (auth && token != null) {
      headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }

  Uri _uri(String path, [Map<String, String>? query]) =>
      Uri.parse('$baseUrl$path').replace(queryParameters: query);

  Future<dynamic> get(String path,
      {bool auth = false, Map<String, String>? query}) async {
    final response =
        await http.get(_uri(path, query), headers: _headers(auth: auth));
    return _decode(response);
  }

  Future<dynamic> post(String path, Map<String, dynamic> body,
      {bool auth = false}) async {
    final response = await http.post(
      _uri(path),
      headers: _headers(auth: auth),
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  Future<dynamic> put(String path, Map<String, dynamic> body,
      {bool auth = false}) async {
    final response = await http.put(
      _uri(path),
      headers: _headers(auth: auth),
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  Future<dynamic> patch(String path, Map<String, dynamic> body,
      {bool auth = false}) async {
    final response = await http.patch(
      _uri(path),
      headers: _headers(auth: auth),
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  dynamic _decode(http.Response response) {
    final dynamic decoded =
        response.body.isEmpty ? <String, dynamic>{} : jsonDecode(response.body);

    if (response.statusCode >= 400) {
      final message = decoded is Map<String, dynamic>
          ? (decoded['message']?.toString() ?? 'Request failed')
          : 'Request failed';
      throw Exception(message);
    }

    return decoded;
  }
}
