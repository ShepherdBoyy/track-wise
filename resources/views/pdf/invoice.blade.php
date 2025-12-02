<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>{{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            line-height: 20px;
            margin: 2rem;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .logo {
            width: 200px;
        }

        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 40px;
        }

        table.data-table th,
        table.data-table td {
            border: 1px solid #000;
            padding: 6px;
            vertical-align: top;
        }

        table.data-table th:nth-child(1),
        table.data-table td:nth-child(1) {
            width: 18%;
        }

        table.data-table th:nth-child(2),
        table.data-table td:nth-child(2) {
            width: 22%;
        }

        table.data-table th:nth-child(3),
        table.data-table td:nth-child(3) {
            width: 60%;
        }

        table.no-border {
            margin-top: 20px;
        }

        table.no-border td {
            border: none;
            padding: 4px 0;
            width: 150px;
        }

        footer {
            position: fixed;
            bottom: 0cm;
            left: 0cm;
            right: 0cm;
            text-align: right;
            font-size: 12px;
            color: #555;
            border-top: 1px solid #ccc;
        }
    </style>
</head>

<body>
    <main>
        <table class="header-table">
            <tr>
                <td>
                    <strong>Progressive Medical Corp.</strong><br>
                    200 C. Raymundo Avenue Caniogan,<br>
                    Pasig City 1606 Philippines
                </td>

                <td align="right">
                    <img src="{{ public_path('images/pmc-logo.jpg') }}" class="logo">
                </td>
            </tr>
        </table>

        <h3 style="font-size: 28px; text-align: center; margin-top: 70px;">
            {{ $invoice->hospital->hospital_name }}
        </h3>

        <table class="no-border">
            <tr>
                <td><strong>Invoice No:</strong></td>
                <td>{{ $invoice->invoice_number }}</td>

                <td><strong>Status:</strong></td>
                <td>{{ $invoice->status }}</td>
            </tr>

            <tr>
                <td><strong>Doc. Date:</strong></td>
                <td>{{ date('m/d/Y', strtotime($invoice->document_date)) }}</td>

                <td><strong>Amount:</strong></td>
                <td>{{ number_format($invoice->amount, 2) }}</td>
            </tr>

            <tr>
                <td><strong>Due Date:</strong></td>
                <td>{{ date('m/d/Y', strtotime($invoice->due_date)) }}</td>
            </tr>
        </table>

        <table class="data-table">
            <thead>
                <tr>
                    <th>Updated At</th>
                    <th>Updated By</th>
                    <th>Description</th>
                </tr>
            </thead>

            <tbody>
                @foreach ($history as $item)
                    <tr>
                        <td>{{ $item->updated_at->format('m/d/Y') }}</td>
                        <td>{{ $item->updater->name }}</td>
                        <td>{{ $item->description }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </main>


    <footer style="margin-top: 40px;">
        @if ($dateClosed)
            @php
                $dateClosedFormatted = \Carbon\Carbon::parse($dateClosed)->translatedFormat("F j, Y");
            @endphp
            This invoice was closed on {{ $dateClosedFormatted }}.
        @else
            @if ($daysRemaining > 0)
                Payment for this invoice is due in {{ $daysRemaining }} days.<br>
            @endif

            @if ($daysRemaining == 0 && $daysOverdue < 0)
                This invoice is overdue by {{ $daysOverdue }} days.<br>
            @endif
        @endif
    </footer>

</body>

</html>
