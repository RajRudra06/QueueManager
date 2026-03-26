import 'package:flutter/material.dart';

import '../../state/session_controller.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({super.key, required this.session});

  final SessionController session;

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController(text: 'student@demo.local');
  final _passwordController = TextEditingController(text: 'student123');

  bool _isLogin = true;
  bool _busy = false;
  bool _asAdmin = false;
  String? _error;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _busy = true;
      _error = null;
    });

    try {
      if (_isLogin) {
        await widget.session.login(
          _emailController.text.trim(),
          _passwordController.text,
        );
      } else {
        await widget.session.register(
          _nameController.text.trim(),
          _emailController.text.trim(),
          _passwordController.text,
          admin: _asAdmin,
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
      }
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Icon(
                      Icons.qr_code_scanner_rounded,
                      size: 80,
                      color: Color(0xFF0D9488),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      _isLogin ? 'Welcome Back' : 'Create Account',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _isLogin
                          ? 'Manage your appointments with ease'
                          : 'Join us to start scheduling today',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 48),
                    if (!_isLogin) ...[
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(
                          hintText: 'Full Name',
                          prefixIcon: Icon(Icons.person_outline),
                        ),
                        validator: (v) =>
                            (v == null || v.trim().isEmpty) ? 'Name is required' : null,
                      ),
                      const SizedBox(height: 16),
                    ],
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        hintText: 'Email Address',
                        prefixIcon: Icon(Icons.email_outlined),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      validator: (v) => (v == null || !v.contains('@'))
                          ? 'Valid email required'
                          : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _passwordController,
                      decoration: const InputDecoration(
                        hintText: 'Password',
                        prefixIcon: Icon(Icons.lock_outline_rounded),
                      ),
                      obscureText: true,
                      validator: (v) => (v == null || v.length < 6)
                          ? 'Minimum 6 characters'
                          : null,
                    ),
                    if (!_isLogin)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: CheckboxListTile(
                          value: _asAdmin,
                          onChanged: (v) => setState(() => _asAdmin = v ?? false),
                          title: const Text('Register as admin account'),
                          controlAffinity: ListTileControlAffinity.leading,
                          contentPadding: EdgeInsets.zero,
                          activeColor: const Color(0xFF0D9488),
                        ),
                      ),
                    if (_error != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 16),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.red[50],
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.red[100]!),
                          ),
                          child: Text(
                            _error!,
                            style: TextStyle(color: Colors.red[700], fontSize: 13),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: _busy ? null : _submit,
                      child: _busy
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : Text(_isLogin ? 'Sign In' : 'Sign Up'),
                    ),
                    const SizedBox(height: 16),
                    TextButton(
                      onPressed: _busy
                          ? null
                          : () => setState(() {
                                _isLogin = !_isLogin;
                                _error = null;
                              }),
                      child: RichText(
                        text: TextSpan(
                          style: TextStyle(color: Colors.grey[600], fontSize: 14),
                          children: [
                            TextSpan(
                                text: _isLogin
                                    ? "Don't have an account? "
                                    : "Already have an account? "),
                            TextSpan(
                              text: _isLogin ? 'Sign Up' : 'Sign In',
                              style: const TextStyle(
                                color: Color(0xFF0D9488),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.blueGrey[50],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          const Text(
                            'Demo Credentials',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF475569),
                            ),
                          ),
                          const SizedBox(height: 8),
                          _buildCredentialRow('Student', 'student@demo.local'),
                          _buildCredentialRow('Admin', 'admin@demo.local'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCredentialRow(String label, String email) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          Text(email, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
