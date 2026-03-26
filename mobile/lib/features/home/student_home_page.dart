import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../state/session_controller.dart';

class StudentHomePage extends StatefulWidget {
  const StudentHomePage({super.key, required this.session});

  final SessionController session;

  @override
  State<StudentHomePage> createState() => _StudentHomePageState();
}

class _StudentHomePageState extends State<StudentHomePage> {
  List<Map<String, dynamic>> _services = [];
  List<Map<String, dynamic>> _slots = [];
  List<Map<String, dynamic>> _appointments = [];
  String? _selectedServiceId;
  String? _message;
  bool _loading = false;
  String _searchQuery = '';

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
      final services = (servicesRes as List).cast<Map<String, dynamic>>();
      _services = services;

      if (_services.isNotEmpty) {
        _selectedServiceId = _services.first['id'].toString();
        await _loadSlots();
      }
      await _loadAppointments();
    } catch (e) {
      _message = e.toString();
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _loadSlots() async {
    if (_selectedServiceId == null) return;
    final slotsRes = await _api
        .get('/slots', query: {'serviceId': _selectedServiceId!});
    _slots = (slotsRes as List).cast<Map<String, dynamic>>();
    if (mounted) setState(() {});
  }

  Future<void> _loadAppointments() async {
    final appointmentsRes = await _api.get('/appointments/mine', auth: true);
    _appointments = (appointmentsRes as List).cast<Map<String, dynamic>>();
    if (mounted) setState(() {});
  }

  Future<void> _book(String slotId) async {
    if (_selectedServiceId == null) return;
    try {
      await _api.post(
        '/appointments',
        {'serviceId': _selectedServiceId, 'slotId': slotId},
        auth: true,
      );
      _showSnackBar('Appointment booked successfully!', isError: false);
      await _loadAppointments();
    } catch (e) {
      _showSnackBar(e.toString().replaceFirst('Exception: ', ''), isError: true);
    }
  }

  Future<void> _cancel(String appointmentId) async {
    try {
      await _api.patch('/appointments/$appointmentId/cancel', {}, auth: true);
      _showSnackBar('Appointment cancelled', isError: false);
      await _loadAppointments();
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
    final filteredSlots = _slots.where((s) =>
        s['label'].toString().toLowerCase().contains(_searchQuery.toLowerCase())).toList();

    final waitingAppointment = _appointments.cast<Map<String, dynamic>?>().firstWhere(
      (a) => a?['status'] == 'WAITING',
      orElse: () => null,
    );

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Mission Control'),
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
              child: CustomScrollView(
                slivers: [
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildHeader(),
                          if (waitingAppointment != null) ...[
                            const SizedBox(height: 24),
                            _buildLiveQueueCard(waitingAppointment),
                          ],
                          const SizedBox(height: 32),
                          _buildSectionTitle('Services', Icons.category_outlined),
                          const SizedBox(height: 16),
                          _buildServiceChips(),
                          const SizedBox(height: 32),
                          _buildSectionTitle('Available Slots', Icons.event_available_outlined),
                          const SizedBox(height: 16),
                          _buildSearchField(),
                          const SizedBox(height: 16),
                        ],
                      ),
                    ),
                  ),
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                        maxCrossAxisExtent: 400,
                        mainAxisSpacing: 16,
                        crossAxisSpacing: 16,
                        childAspectRatio: 2.5,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) => _buildSlotCard(filteredSlots[index]),
                        childCount: filteredSlots.length,
                      ),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 16),
                          _buildSectionTitle('My Timeline', Icons.history_rounded),
                          const SizedBox(height: 16),
                          ..._appointments.map((a) => _buildAppointmentCard(a)),
                          if (_appointments.isEmpty)
                            Center(
                              child: Padding(
                                padding: const EdgeInsets.all(32.0),
                                child: Text(
                                  'No active appointments found.',
                                  style: TextStyle(color: Colors.grey[500], fontSize: 16),
                                ),
                              ),
                            ),
                          const SizedBox(height: 60),
                        ],
                      ),
                    ),
                  ),
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
          backgroundColor: const Color(0xFF0D9488).withOpacity(0.1),
          child: const Icon(Icons.person_rounded, color: Color(0xFF0D9488), size: 32),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hello, ${widget.session.user?['name'] ?? 'Student'}!',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            Text(
              'Ready to manage your queue?',
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildLiveQueueCard(Map<String, dynamic> appointment) {
    final position = appointment['position'] ?? '?';
    
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0D9488), Color(0xFF14B8A6)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0D9488).withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
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
                  'Your Current Position',
                  style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 4),
                Text(
                  'Rank #$position',
                  style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'Hold tight, you\'re almost there!',
                  style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 12),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.timer_rounded, color: Colors.white, size: 40),
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
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
      ],
    );
  }

  Widget _buildServiceChips() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _services.map((s) {
          final isSelected = _selectedServiceId == s['id'].toString();
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(s['name'].toString()),
              selected: isSelected,
              onSelected: (selected) async {
                if (selected) {
                  setState(() => _selectedServiceId = s['id'].toString());
                  await _loadSlots();
                }
              },
              selectedColor: const Color(0xFF0D9488),
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : const Color(0xFF475569),
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              backgroundColor: Colors.white,
              elevation: 0,
              pressElevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: BorderSide(color: isSelected ? Colors.transparent : const Color(0xFFE2E8F0)),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSearchField() {
    return TextField(
      onChanged: (v) => setState(() => _searchQuery = v),
      decoration: InputDecoration(
        hintText: 'Search slots...',
        prefixIcon: const Icon(Icons.search_rounded),
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildSlotCard(Map<String, dynamic> slot) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    slot['label'].toString(),
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.people_outline, size: 14, color: Colors.grey[600]),
                      const SizedBox(width: 4),
                      Text(
                        'Capacity: ${slot['capacity']}',
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            ElevatedButton(
              onPressed: () => _book(slot['id'].toString()),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(80, 40),
                padding: const EdgeInsets.symmetric(horizontal: 16),
              ),
              child: const Text('Book'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAppointmentCard(Map<String, dynamic> a) {
    final status = a['status'].toString();
    final isWaiting = status == 'WAITING';
    final positionCount = a['position'] != null ? ' (Pos: #${a['position']})' : '';
    
    Color statusColor;
    IconData statusIcon;
    
    switch (status) {
      case 'WAITING':
        statusColor = const Color(0xFFF59E0B);
        statusIcon = Icons.timer_outlined;
        break;
      case 'COMPLETED':
        statusColor = const Color(0xFF10B981);
        statusIcon = Icons.check_circle_outline_rounded;
        break;
      case 'CANCELLED':
        statusColor = const Color(0xFFEF4444);
        statusIcon = Icons.cancel_outlined;
        break;
      default:
        statusColor = Colors.grey;
        statusIcon = Icons.help_outline_rounded;
    }

    return Card(
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: statusColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(statusIcon, color: statusColor, size: 24),
        ),
        title: Text(
          'Appointment ID: ${a['id'].toString().substring(0, 8).toUpperCase()}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                '$status$positionCount',
                style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        trailing: isWaiting
            ? IconButton(
                onPressed: () => _cancel(a['id'].toString()),
                icon: const Icon(Icons.close_rounded, color: Colors.grey),
                tooltip: 'Cancel',
              )
            : null,
      ),
    );
  }
}
