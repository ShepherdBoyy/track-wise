<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Invoice Aging Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 9px;
            color:#000000;
            background: #ffffff;
            padding: 28px 32px 28px 32px;
        }

        .report-header {
            border-bottom: 2px solid #000000;
            padding-bottom: 12px;
            margin-bottom: 22px;
        }

        .report-title {
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .report-meta {
            font-size: 9px;
            color: #444444;
            margin-bottom: 8px;
        }

        .report-filters {
            margin-top: 6px;
        }

        .filter-item {
            display: inline-block;
            border: 1px solid #000000;
            padding: 2px 8px;
            font-size: 8px;
            margin-right: 5px;
        }

        .section-label {
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666666;
            margin-bottom: 5px;
        }

        .grand-totals-section {
            margin-bottom: 26px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .totals-table th {
            background-color: #000000;
            color: #ffffff;
            font-size: 8px;
            font-weight: bold;
            text-align: center;
            padding: 6px 4px;
            border: 1px solid #000000;
        }

        .totals-table td {
            font-size: 9px;
            font-weight: bold;
            text-align: center;
            padding: 8px 4px;
            border: 1px solid #bbbbbb;
            background-color: #f4f4f4;
        }

        .subtotals-table th {
            background-color: #444444;
            color: #ffffff;
            font-size: 8px;
            font-weight: bold;
            text-align: center;
            padding: 5px 4px;
            border: 1px solid #444444;
        }

        .subtotals-table td {
            font-size: 9px;
            font-weight: bold;
            text-align: center;
            padding: 6px 4px;
            border: 1px solid #cccccc;
            background-color: #fafafa;
        }

        .hospital-block {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .hospital-block-first {
            margin-bottom: 20px;
        }

        .hospital-block-inner {
            border: 1.5px solid #000000;
        }

        .hospital-header {
            background-color: #000000;
            color: #ffffff;
            padding: 9px 11px;
        }

        .hospital-name {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 4px;
        }

        .hospital-meta-left {
            font-size: 8px;
            color: #cccccc;
        }

        .hospital-meta-right {
            font-size: 8px;
            color: #cccccc;
            text-align: right;
        }

        .report-footer {
            position: fixed;
            bottom: 14px;
            left: 32px;
            right: 32px;
            border-top: 1px solid #bbbbbb;
            padding-top: 5px;
        }

        .footer-right {
            font-size: 8px;
            color: #666666;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="report-title">Invoice Aging Report</div>
        <div class="report-meta">Generated: {{ $generatedAt }}</div>
        <div class="report-filters">
            <span class="filter-item">{{ $filterLabel }}</span>
            <span class="filter-item">Aging: {{ $agingLabel }}</span>
        </div>
    </div>

    <div class="grand-totals-section">
        <div class="section-label">Aging Summary &mdash; Grand Totals</div>
        <table class="totals-table">
            <thead>
                <tr>
                    @if (in_array("current", $agingFilter))
                        <th>Current</th>
                    @endif
                    @if (in_array("30", $agingFilter))
                        <th>1&ndash;30 Days</th>
                    @endif
                    @if (in_array("31-60", $agingFilter))
                        <th>31&ndash;60 Days</th>
                    @endif
                    @if (in_array("61-90", $agingFilter))
                        <th>61&ndash;90 Days</th>
                    @endif
                    @if (in_array("over_90", $agingFilter))
                        <th>91 Over</th>
                    @endif
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    @if (in_array("current", $agingFilter))
                        <td>&#8369; {{ number_format($grandTotals["current"], 2) }}</td>
                    @endif
                    @if (in_array("30", $agingFilter))
                        <td>&#8369; {{ number_format($grandTotals["30"], 2) }}</td>
                    @endif
                    @if (in_array("31-60", $agingFilter))
                        <td>&#8369; {{ number_format($grandTotals["31-60"], 2) }}</td>
                    @endif
                    @if (in_array("61-90", $agingFilter))
                        <td>&#8369; {{ number_format($grandTotals["61-90"], 2) }}</td>
                    @endif
                    @if (in_array("over_90", $agingFilter))
                        <td>&#8369; {{ number_format($grandTotals["over_90"], 2) }}</td>
                    @endif
                    <td>&#8369; {{ number_format($grandTotals["total"], 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    @forelse($hospitalBlocks as $block)
        <div class="{{ $loop->first ? "hospital-block-first" : "hospital-block" }}">
            <div class="hospital-block-inner">
                <div class="hospital-header">
                    <div class="hospital-name">{{ $block["hospital"]->hospital_name }}</div>
                    <table style="table-layout: fixed;">
                        <tr>
                            <td
                                style="width: 55%; border: none; background: transparent; padding: 0;"
                                class="hospital-meta-left"
                            >
                                {{ $block["hospital"]->hospital_number }}
                                &nbsp;&bull;&nbsp;
                                Area: {{ $block["hospital"]->area->area_name ?? "&mdash;" }}
                            </td>
                            <td 
                                style="width: 45%; border: none; background: transparent; padding: 0;"
                                class="hospital-meta-right"
                            >
                                Credit Term: {{ $block["hospital"]->credit_term ?: "&mdash;" }}
                                &nbsp;&nbsp;
                                Credit Limit: &#8369; {{ number_format($block["hospital"]->credit_limit, 2) }}
                            </td>
                        </tr>
                    </table>
                </div>

                <div>
                    <div class="section-label">Aging Subtotal</div>
                    <table class="subtotals-table">
                        <thead>
                            <tr>
                                @if (in_array("current", $agingFilter))
                                    <th>Current</th>
                                @endif
                                @if (in_array("30", $agingFilter))
                                    <th>1&ndash;30 Days</th>
                                @endif
                                @if (in_array("31-60", $agingFilter))
                                    <th>31&ndash;60 Days</th>
                                @endif
                                @if (in_array("61-90", $agingFilter))
                                    <th>61&ndash;90 Days</th>
                                @endif
                                @if (in_array("over_90", $agingFilter))
                                    <th>91 Over</th>
                                @endif
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                @if (in_array("current", $agingFilter))
                                    <td>&#8369; {{ number_format($grandTotals["current"], 2) }}</td>
                                @endif
                                @if (in_array("30", $agingFilter))
                                    <td>&#8369; {{ number_format($grandTotals["30"], 2) }}</td>
                                @endif
                                @if (in_array("31-60", $agingFilter))
                                    <td>&#8369; {{ number_format($grandTotals["31-60"], 2) }}</td>
                                @endif
                                @if (in_array("61-90", $agingFilter))
                                    <td>&#8369; {{ number_format($grandTotals["61-90"], 2) }}</td>
                                @endif
                                @if (in_array("over_90", $agingFilter))
                                    <td>&#8369; {{ number_format($grandTotals["over_90"], 2) }}</td>
                                @endif
                                <td>&#8369; {{ number_format($grandTotals["total"], 2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    
    @empty
        <div class="empty-state">
            No invoices found for selected filters.
        </div>
    @endforelse

    <div class="report-footer">
        <table style="table-layout: fixed; width: 100%;">
            <tr>
                <td class="footer-right" style="width: 100%; border: none; backkground: transparent; padding: 0;">
                    TrackWise Invoice Aging Report &mdash; {{ $generatedAt  }}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>