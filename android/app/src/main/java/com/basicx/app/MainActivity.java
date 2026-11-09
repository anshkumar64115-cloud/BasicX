package com.basicx.app;

import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

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
                        "  try {" +
                        "    const f = document.getElementById('appframe');" +
                        "    if (f && f.contentWindow) {" +
                        "      const w = f.contentWindow;" +
                        "      if (w.location.hash && w.history.length > 1) {" +
                        "        w.history.back();" +
                        "        return 'handled';" +
                        "      }" +
                        "    }" +
                        "    const v = document.getElementById('viewer');" +
                        "    if (v && v.classList.contains('active')) {" +
                        "      history.back();" +
                        "      return 'handled';" +
                        "    }" +
                        "    return 'exit';" +
                        "  } catch(e) {" +
                        "    return 'exit';" +
                        "  }" +
                        "})()",
                        value -> {
                            if ("\"exit\"".equals(value)) {
                                finish();
                            }
                        }
                    );
                }
            }
        );
    }
}
