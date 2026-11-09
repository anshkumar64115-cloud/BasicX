package com.basicx.app;

import android.os.Bundle;
import android.view.View;
import androidx.activity.OnBackPressedCallback;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Handle Android status bar and navigation bar spacing
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        View webView = bridge.getWebView();

        ViewCompat.setOnApplyWindowInsetsListener(webView, (view, insets) -> {
            Insets bars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars()
            );
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            return WindowInsetsCompat.CONSUMED;
        });

        ViewCompat.requestApplyInsets(webView);

        // Handle the physical Android Back button
        getOnBackPressedDispatcher().addCallback(this,
            new OnBackPressedCallback(true) {
                @Override
                public void handleOnBackPressed() {

                    if (bridge == null || bridge.getWebView() == null) {
                        finish();
                        return;
                    }

                    bridge.getWebView().evaluateJavascript(
                        "(function() {" +
                        "  const f = document.getElementById('appframe');" +
                        "  if (f && f.contentWindow) {" +
                        "    const w = f.contentWindow;" +
                        "    if (w.location.hash && w.location.hash.length > 1) {" +
                        "      w.history.back();" +
                        "      return 'INNER';" +
                        "    }" +
                        "  }" +
                        "  const v = document.getElementById('viewer');" +
                        "  if (v && v.classList.contains('active')) {" +
                        "    history.back();" +
                        "    return 'SUBJECT';" +
                        "  }" +
                        "  return 'EXIT';" +
                        "})()",
                        value -> {
                            if ("\"EXIT\"".equals(value)) {
                                finish();
                            }
                        }
                    );
                }
            }
        );
    }
}
