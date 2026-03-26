import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../state/session_controller.dart';

class AdminHomePage extends StatefulWidget {
  const AdminHomePage({super.key, required this.session});

  final SessionController session;

  @override
  State<AdminHomePage> createState() => _AdminHomePageState();
}

class _AdminHomePageState extends State<AdminHomePage> {
  List<Map<String, dynamic>> _services = [];
  List<Map<String, dynamic>> _slots = [];
  String? _selectedServiceId;
  String? _selectedSlotId;
  Map<String, dynamic>? _queue;
  bool _loading = false;

  ApiClient get _api => widget.session.api;

  @override
  void initState() {
    super.initState();
    _loadInitial();
  }

  Future<void> _loadInitial() async {
    setState(() => _loading = true);
    try {
      final servicesRes = await _api.get('/services');
      _services = (servicesRes as List).cast<Map<String, dynamic>>();

      if (_services.isNotEmpty) {
        _selectedServiceId = _services.first['id'].toString();
        await _loadSlots();
      }
    } catch (e) {
      _showSnackBar(e.toString().replaceFirst('Exception: ', ''), isError: true);
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _loadSlots() async {
    if (_selectedServiceId == null) return;
    final slotsRes = await _api.get('/slots', query: {'serviceId': _selectedServiceId!});
    _slots = (slotsRes as List).cast<Map<String, dynamic>>();

    if (_slots.isNotEmpty) {
      _selectedSlotId = _slots.first['id'].toString();
      await _loadQueue();
    } else {
      _selectedSlotId = null;
      _queue = null;
    }
    if (mounted) setState(() {});
  }

  Future<void> _loadQueue() async {
    if (_selectedSlotId == null) return;
    final queueRes = await _api.get('/admin/queue/$_selectedSlotId', auth: true);
    _queue = Map<String, dynamic>.from(queueRes as Map);
    if (mounted) setState(() {});
  }

  Future<void> _advanceQueue() async {
    if (_selectedSlotId == null) return;
    try {
      await _api.post('/admin/queue/$_selectedSlotId/advance', {}, auth: true);
      _showSnackBar('Queue advanced!', isError: false);
      await _loadQueue();
    } catch (e) {
      _showSnackBar(e.toString().replaceFirst('Exception: ', ''), isError: true);
    }
  }

  void _showSnackBar(String message, {required bool isError}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red[700] : const Color(0xFF0D9488),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final waitingCount = _queue?['waitingCount'] ?? 0;
    final queueItems = ((_queue?['queue'] ?? []) as List).cast<Map<String, dynamic>>();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Admin Console'),
        actions: [
          IconButton(
            onPressed: widget.session.logout,
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Logout',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadInitial,
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  _buildHeader(),
                  const SizedBox(height: 32),
                  _buildSelectionCard(),
                  const SizedBox(height: 32),
                  if (_queue != null) ...[
                    _buildQueueSummaryCard(waitingCount),
                    const SizedBox(height: 24),
                    _buildSectionTitle('Active Queue', Icons.view_headline_rounded),
                    const SizedBox(height: 16),
                    ...queueItems.map((item) => _buildQueueItem(item)),
                    if (queueItems.isEmpty)
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.all(48.0),
                          child: Text(
                            'No appointments in queue.',
                            style: TextStyle(color: Colors.grey[500]),
                          ),
                        ),
                      ),
                  ] else
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(48.0),
                        child: Text(
                          'Select a service and slot to manage queue.',
                          style: TextStyle(color: Colors.grey[500]),
                        ),
                      ),
                    ),
                  const SizedBox(height: 48),
                ],
              ),
            ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        CircleAvatar(
          radius: 28,
          backgroundColor: const Color(0xFF0F172A).withOpacity(0.1),
          child: const Icon(Icons.admin_panel_settings_rounded, color: Color(0xFF0F172A), size: 32),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome, ${widget.session.user?['name'] ?? 'Admin'}',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            Text(
              'Real-time Queue Controller',
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSelectionCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            DropdownButtonFormField<String>(
              value: _selectedServiceId,
              decoration: const InputDecoration(labelText: 'Service Category'),
              items: _services
                  .map((s) => DropdownMenuItem(
                        value: s['id'].toString(),
                        child: Text(s['name'].toString()),
                      ))
                  .toList(),
              onChanged: (value) async {
                setState(() => _selectedServiceId = value);
                await _loadSlots();
              },
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedSlotId,
              decoration: const InputDecoration(labelText: 'Available Slot'),
              items: _slots
                  .map((s) => DropdownMenuItem(
                        value: s['id'].toString(),
                        child: Text('${s['label']}'),
                      ))
                  .toList(),
              onChanged: (value) async {
                setState(() => _selectedSlotId = value);
                await _loadQueue();
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQueueSummaryCard(int count) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF334155)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Current Waitlist',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
                Text(
                  '$count Persons',
                  style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          ElevatedButton.icon(
            onPressed: count > 0 ? _advanceQueue : null,
            icon: const Icon(Icons.skip_next_rounded),
            label: const Text('Advance'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0D9488),
              minimumSize: const Size(120, 56),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 20, color: const Color(0xFF0D9488)),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildQueueItem(Map<String, dynamic> item) {
    final status = item['status'].toString();
    final isWaiting = status == 'WAITING';

    return Card(
      child: ListTile(
        title: Text(
          'Appt: ${item['id'].toString().substring(0, 8).toUpperCase()}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text('User Ref: ${item['userId'].toString().substring(0, 6)}...'),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: isWaiting ? const Color(0xFFF59E0B).withOpacity(0.1) : const Color(0xFF10B981).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            status,
            style: TextStyle(
              color: isWaiting ? const Color(0xFFF59E0B) : const Color(0xFF10B981),
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
