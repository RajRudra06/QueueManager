import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/main.dart';

void main() {
  testWidgets('renders auth screen on cold start', (WidgetTester tester) async {
    await tester.pumpWidget(const SmartQueueApp());

    expect(find.text('Smart Queue Login'), findsOneWidget);
  });
}
