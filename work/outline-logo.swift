import Foundation
import CoreText
import CoreGraphics

let font = CTFontCreateWithName("GeezaPro" as CFString, 250, nil)
let string = NSAttributedString(string: "الواصل", attributes: [NSAttributedString.Key(kCTFontAttributeName as String): font])
let line = CTLineCreateWithAttributedString(string)
let shape = CGMutablePath()
for run in CTLineGetGlyphRuns(line) as! [CTRun] {
    let count = CTRunGetGlyphCount(run)
    var glyphs = [CGGlyph](repeating: 0, count: count)
    var positions = [CGPoint](repeating: .zero, count: count)
    CTRunGetGlyphs(run, CFRange(location: 0, length: 0), &glyphs)
    CTRunGetPositions(run, CFRange(location: 0, length: 0), &positions)
    let attrs = CTRunGetAttributes(run) as NSDictionary
    let runFont = attrs[kCTFontAttributeName] as! CTFont
    for i in 0..<count {
        if let path = CTFontCreatePathForGlyph(runFont, glyphs[i], nil) {
            shape.addPath(path, transform: CGAffineTransform(translationX: positions[i].x, y: positions[i].y))
        }
    }
}
let bounds = shape.boundingBoxOfPath
var transform = CGAffineTransform(a: 1, b: 0, c: 0, d: -1, tx: 20-bounds.minX, ty: 20+bounds.maxY)
let path = shape.copy(using: &transform)!
func p(_ point: CGPoint) -> String { String(format: "%.3f %.3f", Double(point.x), Double(point.y)) }
var commands = [String]()
path.applyWithBlock { pointer in
    let e = pointer.pointee
    switch e.type {
    case .moveToPoint: commands.append("M" + p(e.points[0]))
    case .addLineToPoint: commands.append("L" + p(e.points[0]))
    case .addQuadCurveToPoint: commands.append("Q" + p(e.points[0]) + " " + p(e.points[1]))
    case .addCurveToPoint: commands.append("C" + p(e.points[0]) + " " + p(e.points[1]) + " " + p(e.points[2]))
    case .closeSubpath: commands.append("Z")
    @unknown default: break
    }
}
let w = Int(ceil(bounds.width+40)), h = Int(ceil(bounds.height+40))
let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"\(w)\" height=\"\(h)\" viewBox=\"0 0 \(w) \(h)\"><path fill=\"#91A8BC\" d=\"\(commands.joined(separator: " "))\"/></svg>"
try svg.write(toFile: CommandLine.arguments[1], atomically: true, encoding: .utf8)
print("SVG outlines exported: \(w)x\(h), \(commands.count) path commands")
